import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load('/textures/particles/4.png');

// --> PARTICLES

// -> Particle Sphere
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

// -> Random Particles
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
const colours = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 50;
  colours[i] = Math.random();
}
particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 1,
  sizeAttenuation: true,
  //   map: particlesTexture,   IMPORTANT: keeps black edges, causes overlapping
  transparent: true,
  alphaMap: particlesTexture,
  //   alphaTest: 0.001,        -> pretty good fix but not perfect
  //   depthTest: false,        -> causes bugs with other objects
  //   blending: THREE.AdditiveBlending, -> use with depthWrite: false - causes illumination by blending
  depthWrite: false, //-> often a good solution, sometimes has bugs

  vertexColors: true, // -> enables multicolour
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000
);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const gui = new GUI();
const params = {};
gui.hide();
const particlesFolder = gui.addFolder('Particles');
particlesFolder.add(particlesMaterial, 'size').min(0.001).max(10).step(0.001);
particlesFolder.addColor(particlesMaterial, 'color');

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //   particles.position.y = -elapsedTime;

  // --> ANIMATE PARTICLES
  // -> Works, but not performant
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

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

window.addEventListener('keydown', (e) => {
  if (e.key === 'h') gui._hidden ? gui.show() : gui.hide();
});
