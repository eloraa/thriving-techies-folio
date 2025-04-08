'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

interface ExtendedShaderPass extends ShaderPass {
  setPixelSize?: (size: number) => void;
}

export const Orange = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    model: THREE.Object3D | null;
  } | null>(null);

  const colorState = useRef({
    time: 0,
    duration: 3,
    colors: {
      red: {
        primary: new THREE.Color('#FF6A3B'),
        edge: new THREE.Color('#BB6D66'),
      },
      green: {
        primary: new THREE.Color('#2AE246'),
        edge: new THREE.Color('#1A9E2F'),
      },
    },
  });

  const config = {
    pixelSize: 4,
    gradientColors: {
      center: '#FF6A3B',
      middle: '#FF6A3B',
      edge: '#BB6D66',
    },
    lightIntensity: {
      ambient: 0.2,
      directional: 1.2,
      fill: 0.4,
      highlight: 1.0,
    },
  };

  const positionOffset = {
    x: 0.15,
    y: -1,
    z: 0,
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000);

    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 4;
    const camera = new THREE.OrthographicCamera((frustumSize * aspect) / -2, (frustumSize * aspect) / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
    });

    const composer = new EffectComposer(renderer, renderTarget);
    const renderPass = new RenderPass(scene, camera);

    composer.addPass(renderPass);

    const createPixelPass = (): ExtendedShaderPass => {
      const pixelShader = {
        uniforms: {
          tDiffuse: { value: null },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          pixelSize: { value: config.pixelSize * window.devicePixelRatio },
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

      const pass = new ShaderPass(pixelShader) as ExtendedShaderPass;
      pass.setPixelSize = function (size: number) {
        this.uniforms.pixelSize.value = size;
      };
      return pass;
    };

    const pixelPass = createPixelPass();
    composer.addPass(pixelPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.4, 0.1);
    composer.addPass(bloomPass);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-10, 5, -5);
    scene.add(fillLight);

    const highlightLight = new THREE.SpotLight(0xffffff, 0.7);
    highlightLight.position.set(5, 8, 2);
    highlightLight.angle = Math.PI / 6;
    highlightLight.penumbra = 0.2;
    scene.add(highlightLight);

    const createGradientTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      if (!context) return null;

      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, config.gradientColors.center);
      gradient.addColorStop(0.7, config.gradientColors.middle);
      gradient.addColorStop(1, config.gradientColors.edge);

      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return { texture, canvas, context };
    };

    const { texture, canvas, context } = createGradientTexture() || {};

    const appleMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xff6a3b),
      metalness: 0.0,
      roughness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      reflectivity: 0.3,
      envMapIntensity: 0.5,
      map: texture,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.95,
    });

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    dracoLoader.setDecoderConfig({
      type: 'js',
      quantization: {
        POSITION: 12,
        NORMAL: 8,
        TEX_COORD: 10,
        COLOR: 8,
        GENERIC: 12,
      },
    });

    loader.setDRACOLoader(dracoLoader);

    let model: THREE.Object3D | null = null;

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onError = url => {
      console.error('Error loading:', url);
    };
    loader.manager = loadingManager;

    loader.load(
      '/models/nectarine-compressed.glb',
      gltf => {
        console.log('Model loaded successfully:', gltf);
        model = gltf.scene;

        model.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.material = appleMaterial;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.2 / maxDim;
        model.scale.setScalar(scale);

        model.position.x += positionOffset.x;
        model.position.y += positionOffset.y;
        model.position.z += positionOffset.z;

        model.rotation.x = -Math.PI * 0.15;
        model.rotation.y = Math.PI * 0.1;

        scene.add(model);
      },
      progress => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
      },
      error => {
        console.error('Error loading model:', error);
      }
    );

    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const currentRotation = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      targetRotation.x = mouse.x * 0.3;
      targetRotation.y = mouse.y * 0.3;
    };

    window.addEventListener('mousemove', onMouseMove);

    const updateColors = () => {
      const { time, duration, colors } = colorState.current;
      const t = (Math.sin((time * Math.PI) / duration) + 1) / 2;

      const currentColor = new THREE.Color();
      currentColor.lerpColors(colors.green.primary, colors.red.primary, t);
      currentColor.multiplyScalar(1.2);
      appleMaterial.color.copy(currentColor);

      if (context && canvas) {
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);

        const centerColor = currentColor.clone();
        const edgeColor = new THREE.Color().lerpColors(colors.green.edge, colors.red.edge, t);
        edgeColor.multiplyScalar(1.2); // Increase edge color intensity

        gradient.addColorStop(0, `#${centerColor.getHexString()}`);
        gradient.addColorStop(0.6, `#${centerColor.getHexString()}`); // Adjusted gradient distribution
        gradient.addColorStop(1, `#${edgeColor.getHexString()}`);

        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);

        if (texture) {
          texture.needsUpdate = true;
        }
      }

      colorState.current.time = (time + 0.005) % duration;
    };

    const animate = () => {
      requestAnimationFrame(animate);

      updateColors();

      if (model) {
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

        model.rotation.y = Math.PI * 0.1 + currentRotation.x;
        model.rotation.x = -Math.PI * 0.15 + currentRotation.y;

        model.position.y = positionOffset.y + Math.sin(Date.now() * 0.001) * 0.1;
      }

      composer.render();
      //   renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;
      const frustumSize = 4;

      camera.left = (frustumSize * aspect) / -2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = frustumSize / -2;

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderTarget.setSize(width, height);
      composer.setSize(width, height);

      if (pixelPass.setPixelSize) {
        pixelPass.setPixelSize(config.pixelSize * window.devicePixelRatio);
      }
    };

    window.addEventListener('resize', handleResize);

    sceneRef.current = { scene, camera, renderer, composer, model };

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <section className="h-screen sticky top-0 w-full overflow-hidden -z-10">
        <div ref={containerRef} className="w-full h-full pointer-events-none" />
        <div className="absolute inset-0 container flex items-end text-center justify-center md:pb-16 pb-32">
          <h1 className="text-white lg:text-base text-sm">
            <p>Pixels meet purpose</p> <p>A taste of creativity rendered in code.</p>
          </h1>
        </div>
      </section>
      <div className="mb-56"></div>
    </>
  );
};
