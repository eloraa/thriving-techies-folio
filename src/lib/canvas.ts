import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { gsap } from 'gsap';

interface ExtendedShaderPass extends ShaderPass {
  setPixelSize?: (size: number) => void;
}

interface Params {
  pixelSize: number;
  bloomStrength: number;
  bloomRadius: number;
  cameraSpeed: number;
  cameraY: number;
  cameraFov: number;
  cameraRotation: number;
  cameraLensStrength: number;
  mouseXOffset: number;
  mouseYOffset: number;
  bloomColor: string;
  buildingColor: string;
  wireframeColor: string;
  enablePostProcessing: boolean;
  darkMode: boolean;
  cameraZoom: number;
  cameraPositionX: number;
  cameraPositionY: number;
  cameraPositionZ: number;
  scale: number;
  container?: HTMLElement;
}

export class CityCanvas {
  private element: HTMLElement;
  private scroll: { velocity: number; direction: number };
  private PARAMS: Params;
  private noise: (xin: number, yin: number) => number;
  private rows: THREE.Group[];
  private speed: number;
  private noiseZ: number;
  private cubeSize: number;
  private cubeHeight: number;
  private lineSize: number;
  private rowSize: number;
  private depthSize: number;
  private freqX: number;
  private freqZ: number;
  private cameraAnimation: { rotation: number; y: number };
  private cameraMouse: { x: number; y: number };
  private scene: THREE.Scene;
  private viewAspectRatio: number;
  private camera!: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private pixelPass!: ExtendedShaderPass;
  private bloomPass!: UnrealBloomPass;
  private lensEffect!: ShaderPass;
  private renderTarget: THREE.WebGLRenderTarget;
  private handleRaf: () => void;
  private playIntro: boolean;
  private isInitialized: boolean = false;

  constructor(element: HTMLElement = document.body) {
    this.element = element;
    this.scroll = { velocity: 0, direction: -1 };
    this.PARAMS = {
      pixelSize: 2,
      bloomStrength: 0.4,
      bloomRadius: 0.1,
      cameraSpeed: 0.02,
      cameraY: 3.25,
      cameraFov: 100,
      cameraRotation: 0,
      cameraLensStrength: 1.7,
      mouseXOffset: 0.5,
      mouseYOffset: 1,
      bloomColor: '#ffffff',
      buildingColor: '#000000',
      wireframeColor: '#ffffff',
      enablePostProcessing: true,
      darkMode: true,
      cameraZoom: 10,
      cameraPositionX: 0,
      cameraPositionY: 3.25,
      cameraPositionZ: 10,
      scale: 1,
      container: element,
    };

    this.noise = this.createSimplexNoise();
    this.rows = [];
    this.speed = 0.01;
    this.noiseZ = 0;
    this.cubeSize = 1;
    this.cubeHeight = 3.5;
    this.lineSize = 0.01;
    this.rowSize = 31;
    this.depthSize = 15;
    this.freqX = 5;
    this.freqZ = 0.5;
    this.cameraAnimation = { rotation: 50, y: 2 };
    this.cameraMouse = { x: 0, y: 0 };

    this.scene = new THREE.Scene();
    this.viewAspectRatio = 1;
    this.initCamera();

    this.renderer = new THREE.WebGLRenderer({
      alpha: false,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.initEffectComposer();

    this.renderTarget = new THREE.WebGLRenderTarget(this.element.clientWidth, this.element.clientHeight, { type: THREE.HalfFloatType });

    if (this.PARAMS.container) {
      this.PARAMS.container.appendChild(this.renderer.domElement);
    } else {
      this.element.appendChild(this.renderer.domElement);
    }

    this.initGenerativeGrid();

    this.handleRaf = () => {
      this.animationFrame();
    };

    this.playIntro = true;

    this.initAnimation();

    window.addEventListener('resize', () => {
      this.resize();
    });

    (this.element.parentElement || this.element)?.addEventListener('mousemove', e => {
      this.mouseMove(e);
    });

    this.resize();

    this.isInitialized = true;
  }

  private createSimplexNoise() {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;

    const p = new Array(512);
    const perm = new Array(512);
    const permMod12 = new Array(512);

    const grad3 = [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
      [1, 0, 1],
      [-1, 0, 1],
      [1, 0, -1],
      [-1, 0, -1],
      [0, 1, 1],
      [0, -1, 1],
      [0, 1, -1],
      [0, -1, -1],
    ];

    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(Math.random() * 256);
      perm[i] = p[i];
      perm[i + 256] = p[i];
      permMod12[i] = p[i] % 12;
      permMod12[i + 256] = p[i] % 12;
    }

    return (xin: number, yin: number) => {
      let n0, n1, n2;

      const s = (xin + yin) * F2;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);
      const t = (i + j) * G2;

      const X0 = i - t;
      const Y0 = j - t;

      const x0 = xin - X0;
      const y0 = yin - Y0;

      let i1, j1;
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } else {
        i1 = 0;
        j1 = 1;
      }

      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1.0 + 2.0 * G2;
      const y2 = y0 - 1.0 + 2.0 * G2;

      const ii = i & 255;
      const jj = j & 255;
      const gi0 = permMod12[ii + perm[jj]];
      const gi1 = permMod12[ii + i1 + perm[jj + j1]];
      const gi2 = permMod12[ii + 1 + perm[jj + 1]];

      let t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 < 0) {
        n0 = 0.0;
      } else {
        t0 *= t0;
        n0 = t0 * t0 * this.dot(grad3[gi0], x0, y0);
      }

      let t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 < 0) {
        n1 = 0.0;
      } else {
        t1 *= t1;
        n1 = t1 * t1 * this.dot(grad3[gi1], x1, y1);
      }

      let t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 < 0) {
        n2 = 0.0;
      } else {
        t2 *= t2;
        n2 = t2 * t2 * this.dot(grad3[gi2], x2, y2);
      }

      return 70.0 * (n0 + n1 + n2);
    };
  }

  private dot(g: number[], x: number, y: number) {
    return g[0] * x + g[1] * y;
  }

  private initAnimation() {
    this.playIntro = true;
    requestAnimationFrame(this.handleRaf);

    gsap.to(this.cameraAnimation, {
      y: 0,
      duration: 5,
      ease: 'expo.out',
    });

    gsap.to(this.cameraAnimation, {
      rotation: 3.5,
      duration: 5,
      ease: 'expo.out',
    });
  }

  private initGenerativeGrid() {
    for (let i = 0; i < 2 * this.depthSize; i++) {
      this.generateRow(-i);
    }
  }

  private initEffectComposer() {
    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.pixelPass = this.createPixelPass();
    this.composer.addPass(this.pixelPass);

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.PARAMS.bloomStrength, this.PARAMS.bloomRadius, 0);
    this.composer.addPass(this.bloomPass);

    this.lensEffect = new ShaderPass(this.getDistortionShaderDefinition());
    this.composer.addPass(this.lensEffect);
    this.lensEffect.renderToScreen = true;

    this.updateLensDistortion();
  }

  private createPixelPass(): ExtendedShaderPass {
    const pixelShader = {
      uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        pixelSize: { value: this.PARAMS.pixelSize * window.devicePixelRatio },
      },
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                uniform float pixelSize;
                varying vec2 vUv;

                void main() {
                    vec2 dxy = pixelSize / resolution;
                    vec2 coord = dxy * floor(vUv / dxy);
                    gl_FragColor = texture2D(tDiffuse, coord);
                }
            `,
    };

    const pixelPass = new ShaderPass(pixelShader) as ExtendedShaderPass;
    pixelPass.setPixelSize = function (size: number) {
      this.uniforms.pixelSize.value = size;
    };

    return pixelPass;
  }

  private generateRow(z: number) {
    const row = new THREE.Group();
    row.position.set(0 + this.cubeSize / 2 - this.rowSize / 2, 0, z + this.depthSize / 2);

    for (let x = 0; x < this.rowSize; x++) {
      this.generateCube(row, x, -z);
    }

    this.noiseZ += 1;
    this.rows.push(row);
    this.scene.add(row);
  }

  private generateCube(row: THREE.Group, x: number, z: number) {
    let height = ((this.noise(x * this.freqX, this.noiseZ * this.freqZ) + 1) / 2) * this.cubeHeight;

    if ((x + 1) % 4 === 0 || (z + 1) % 4 === 0) {
      height = 0;
    }

    const geometry = new THREE.BoxGeometry(1, height, 1);
    const material = new THREE.MeshBasicMaterial({
      color: this.PARAMS.buildingColor,
      wireframe: false,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, height / 2, 0);
    cube.scale.set(0.998, 0.998, 0.998);
    row.add(cube);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: this.PARAMS.wireframeColor,
      linewidth: 10,
    });

    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    wireframe.position.set(x, height / 2, 0);
    row.add(wireframe);
  }

  private updateRow(row: THREE.Group, index: number) {
    while (row.children.length > 0) {
      row.remove(row.children[0]);
    }

    for (let x = 0; x < this.rowSize; x++) {
      this.generateCube(row, x, -index);
    }

    this.noiseZ += 1;
  }

  private animateGrid() {
    this.rows.forEach((row, index) => {
      row.position.z += this.PARAMS.cameraSpeed;

      if (row.position.z > this.depthSize) {
        row.position.z = -this.depthSize;
        this.updateRow(row, index);
      }
    });
  }

  private mouseMove(e: MouseEvent) {
    gsap.to(this.cameraMouse, {
      x: ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * this.PARAMS.mouseXOffset,
      y: ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * this.PARAMS.mouseYOffset,
      duration: 2,
      ease: 'expo.out',
    });
  }

  private animationFrame() {
    this.camera.position.y = this.PARAMS.cameraPositionY + this.cameraAnimation.y - this.cameraMouse.y;
    this.camera.position.x = this.PARAMS.cameraPositionX + this.cameraMouse.x;
    this.camera.lookAt(0, this.cameraAnimation.rotation + this.PARAMS.cameraRotation, 0);

    this.animateGrid();

    if (this.PARAMS.enablePostProcessing) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    requestAnimationFrame(this.handleRaf);
  }

  private resize() {
    const width = this.element?.parentElement?.clientWidth || this.element.clientWidth;
    const height = this.element.parentElement?.clientHeight || this.element.clientHeight;

    this.camera.aspect = width / height;

    if (this.pixelPass?.setPixelSize) {
      this.pixelPass.setPixelSize(this.PARAMS.pixelSize * window.devicePixelRatio);
    }

    this.renderer.setSize(width, height);

    const scaledWidth = Math.floor(width * this.PARAMS.scale);
    const scaledHeight = Math.floor(height * this.PARAMS.scale);
    this.renderer.setPixelRatio(window.devicePixelRatio * this.PARAMS.scale);

    if (this.composer) {
      this.composer.setSize(scaledWidth, scaledHeight);
    }

    if (this.renderTarget) {
      this.renderTarget.setSize(scaledWidth, scaledHeight);
    }

    this.updateLensDistortion();
    this.camera.updateProjectionMatrix();
  }

  private updateLensDistortion() {
    if (!this.lensEffect) return;

    let strength = this.PARAMS.cameraLensStrength;
    strength = this.camera.aspect > this.viewAspectRatio ? this.PARAMS.cameraLensStrength : 0.5 * this.PARAMS.cameraLensStrength;

    const height = Math.tan(THREE.MathUtils.degToRad(this.PARAMS.cameraFov) / 2) / this.camera.aspect;

    this.lensEffect.uniforms.strength.value = strength;
    this.lensEffect.uniforms.height.value = height;
    this.lensEffect.uniforms.aspectRatio.value = this.camera.aspect;
    this.lensEffect.uniforms.cylindricalRatio.value = 2;
  }

  private getDistortionShaderDefinition() {
    return {
      uniforms: {
        tDiffuse: { type: 't', value: null },
        strength: { type: 'f', value: 0 },
        height: { type: 'f', value: 1 },
        aspectRatio: { type: 'f', value: 1 },
        cylindricalRatio: { type: 'f', value: 1 },
      },
      vertexShader: `
                uniform float strength;
                uniform float height;
                uniform float aspectRatio;
                uniform float cylindricalRatio;
                varying vec3 vUV;
                varying vec2 vUVDot;
                void main() {
                    gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));
                    float scaledHeight = strength * height;
                    float cylAspectRatio = aspectRatio * cylindricalRatio;
                    float aspectDiagSq = aspectRatio * aspectRatio + 1.0;
                    float diagSq = scaledHeight * scaledHeight * aspectDiagSq;
                    vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));
                    float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;
                    float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);
                    vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;
                    vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);
                    vUV.xy += uv;
                }
            `,
      fragmentShader: `
                uniform sampler2D tDiffuse;
                varying vec3 vUV;
                varying vec2 vUVDot;
                void main() {
                    vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;
                    gl_FragColor = texture2DProj(tDiffuse, uv);
                }
            `,
    };
  }

  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(this.PARAMS.cameraFov, this.element.clientWidth / this.element.clientHeight, 0.1, 2000);
    this.camera.position.z = 10;
    this.camera.position.y = this.PARAMS.cameraY + this.cameraAnimation.y;
    this.camera.lookAt(0, 0, 0);
  }

  public get initialized(): boolean {
    return this.isInitialized;
  }

  public setScale(scale: number) {
    this.PARAMS.scale = Math.max(0.1, Math.min(1, scale)); // Clamp between 0.1 and 1
    this.resize();
  }

  public getScale(): number {
    return this.PARAMS.scale;
  }
}
