import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Meshes
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere1.position.x = -2;
const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
const sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere3.position.x = 2;
scene.add(sphere1, sphere2, sphere3);

const size = { width: window.innerWidth, height: window.innerHeight };

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.01,
  1000
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// GUI
const gui = new GUI();

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

// Ticker
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// Event Listeners
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
