import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';

const gui = new GUI();
const guiParams = {};

const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load('/textures/canada-flag.png');

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(1, 1, 1, 512, 512, 512);
// const geometry = new THREE.TorusKnotGeometry(1, 0.1, 512, 512);
// const geometry = new THREE.PlaneGeometry(1, 1, 512, 512);
// const geometry = new THREE.SphereGeometry(1, 1, 512, 512);
// const geometry = new THREE.TorusGeometry(1, 0.8, 512, 512);
// const geometry = new THREE.ConeGeometry(1, 1, 512, 512, false);
// const geometry = new THREE.DodecahedronGeometry(3, 12);
const geometry = new THREE.CapsuleGeometry(1, 3, 512, 512);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);
for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uRandom: { value: 0 },
  },
});

const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.set(-2, 2, 4);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // animate
  material.uniforms.uTime.value = elapsedTime;
  material.uniforms.uRandom.value = Math.random();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});
window.addEventListener('keypress', (e) => {
  if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
});
