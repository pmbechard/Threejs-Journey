import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import { BufferGeometry } from 'three';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

// --> GALAXY
const params = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessStrength: 3,
  insideColour: '#ff6030',
  outsideColour: '#1b3984',
};

let geometry = null;
let material = null;
let points = null;
const generateGalaxy = () => {
  if (geometry) geometry.dispose();
  if (material) material.dispose();
  if (points) scene.remove(points);

  geometry = new BufferGeometry();
  const positions = new Float32Array(params.count * 3);
  const colours = new Float32Array(params.count * 3);

  const insideColour = new THREE.Color(params.insideColour);
  const outsideColour = new THREE.Color(params.outsideColour);

  for (let i = 0; i < params.count; i++) {
    // -> Positions
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;
    const spinAngle = radius * params.spin;

    const randomX =
      Math.pow(Math.random(), params.randomnessStrength) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), params.randomnessStrength) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), params.randomnessStrength) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // -> Colours
    const mixedColour = insideColour
      .clone()
      .lerp(outsideColour, radius / params.radius);

    colours[i3] = mixedColour.r;
    colours[i3 + 1] = mixedColour.g;
    colours[i3 + 2] = mixedColour.b;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));

  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.01,
  1000
);
camera.position.y = 3;
camera.position.x = 3;
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const gui = new GUI({ width: 350 });
gui
  .add(params, 'count')
  .min(100)
  .max(100000)
  .step(100)
  .name('Star Count')
  .onFinishChange(generateGalaxy);
gui
  .add(params, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .name('Star Size')
  .onFinishChange(generateGalaxy);
gui
  .add(params, 'radius')
  .min(0.01)
  .max(20)
  .step(0.01)
  .name('Galaxy Radius')
  .onFinishChange(generateGalaxy);
gui
  .add(params, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .name('Galaxy Branches')
  .onFinishChange(generateGalaxy);
gui
  .add(params, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Branch Spin')
  .onFinishChange(generateGalaxy);
gui
  .add(params, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .name('Randomness')
  .onFinishChange(generateGalaxy);
gui
  .add(params, 'randomnessStrength')
  .min(1)
  .max(10)
  .step(0.001)
  .name('Randomness Strength')
  .onFinishChange(generateGalaxy);
gui
  .addColor(params, 'insideColour')
  .name('Inside Colour')
  .onFinishChange(generateGalaxy);
gui
  .addColor(params, 'outsideColour')
  .name('Outside Colour')
  .onFinishChange(generateGalaxy);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
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
  if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
});
