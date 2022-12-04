import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

// --> Loaders
const textureLoader = new THREE.TextureLoader();

// --> Scene Settings
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const sizes = { width: window.innerWidth, height: window.innerHeight };

// --> Meshes
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: '#a9c388' })
);
floor.rotation.x = Math.PI / -2;
scene.add(floor);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ roughness: 0.7 })
);
sphere.position.y = 1;
scene.add(sphere);

// --> Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xffffff, 0.5);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

// --> Cameras
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.fromArray([4, 2, 5]);

// --> Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> GUI
const gui = new GUI();
gui.hide();
const lightsFolder = gui.addFolder('Lights');
lightsFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(1)
  .name('Ambient Intensity');
lightsFolder.add(moonLight, 'intensity').min(0).max(1).name('Moon Intensity');
lightsFolder.add(moonLight.position, 'x').min(-5).max(5).name('Moon x');
lightsFolder.add(moonLight.position, 'y').min(-5).max(5).name('Moon y');
lightsFolder.add(moonLight.position, 'z').min(-5).max(5).name('Moon z');

// --> Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

// --> Ticker
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
};
tick();

// --> Event Listeners
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'h') gui._hidden ? gui.show() : gui.hide();
});
