import * as THREE from 'three';

export class GradientEffect {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private shaderMaterial: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private uniforms: {
    u_ratio: { value: number };
    u_time: { value: number };
    u_width: { value: number };
    u_coloring: { value: number };
    u_speed: { value: number };
    u_circ: { value: number };
    u_step: { value: number };
    u_collision: { value: number };
    u_point: { value: THREE.Vector2 };
  };
  private pointer: { x: number; y: number };
  private container: HTMLElement;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.pointer = { x: 0.5, y: 0.5 };

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.uniforms = {
      u_ratio: { value: container.clientWidth / container.clientHeight },
      u_time: { value: 0 },
      u_width: { value: container.clientWidth / 1.5 < 370 ? container.clientWidth / 1.5 : 370 },
      u_coloring: { value: 0.35 },
      u_speed: { value: 0.1 },
      u_circ: { value: 0.05 },
      u_step: { value: 0.45 },
      u_collision: { value: 1000 },
      u_point: { value: new THREE.Vector2(0.5, 0.5) },
    };

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
                varying vec2 vTexCoord;
                void main() {
                    vTexCoord = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                #ifdef GL_ES
                precision mediump float;
                #endif

                varying vec2 vTexCoord;

                uniform float u_ratio;
                uniform float u_time;
                uniform float u_width;
                uniform float u_coloring;
                uniform float u_speed;
                uniform float u_circ;
                uniform float u_step;
                uniform float u_collision;
                uniform vec2 u_point;

                vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
                
                float snoise(vec2 v){
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                    -0.577350269189626, 0.024390243902439);
                    vec2 i = floor(v + dot(v, C.yy));
                    vec2 x0 = v - i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod(i, 289.0);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                    dot(x12.zw, x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                    vec3 g;
                    g.x = a0.x * x0.x + h.x * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                vec3 hsv2rgb(vec3 c) {
                    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                }

                float get_noise(vec2 uv, float t){
                    float SCALE = 4.;
                    float noise = snoise(vec2(uv.x * .9 * SCALE, -uv.y * SCALE - t));
                    SCALE = 9.;
                    noise += .2 * snoise(vec2(uv.x * SCALE + 3. * t, uv.y * .8 * SCALE));
                    noise += 1.;
                    return noise;
                }

                float circle_s (vec2 dist, float radius) {
                    return smoothstep(0., radius, pow(dot(dist, dist), .3) * .1);
                }

                void main() {
                    vec2 uv = vTexCoord;
                    uv /= (u_collision / u_width);
                    uv.y /= u_ratio;

                    vec2 mouse = vTexCoord - u_point;
                    mouse.y /= u_ratio;

                    float t = u_time * u_speed;

                    float noise = get_noise(uv, t);
                    noise *= circle_s(mouse, u_circ);

                    const float STEPS = 5.;
                    float stepped_noise = floor(noise * STEPS) / STEPS;
                    float d = -.5 * pow(stepped_noise, u_step);

                    vec3 hsv = vec3(u_coloring + d * .4, 1., 1.);
                    vec3 col = hsv2rgb(hsv);

                    float opacity = .9 * smoothstep(.45, .46, noise);
                    col *= opacity;

                    gl_FragColor = vec4(col, opacity);
                }
            `,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.shaderMaterial);
    this.scene.add(this.mesh);

    window.addEventListener('resize', this.resize.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));

    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.uniforms.u_time.value += 0.01;
    this.renderer.render(this.scene, this.camera);
  };

  private onMouseMove = (event: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.pointer.x = (event.clientX - rect.left) / rect.width;
    this.pointer.y = 1 - (event.clientY - rect.top) / rect.height;
    this.uniforms.u_point.value.set(this.pointer.x, this.pointer.y);
  };

  private resize = () => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.renderer.setSize(width, height);
    this.uniforms.u_ratio.value = width / height;
    this.uniforms.u_width.value = width / 1.5 < 370 ? width / 1.5 : 370;
  };

  public dispose() {
    window.removeEventListener('resize', this.resize);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.renderer.dispose();
    this.shaderMaterial.dispose();
    this.mesh.geometry.dispose();
  }
}
