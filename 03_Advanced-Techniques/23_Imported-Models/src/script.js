import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

// -> PARAMETERS
const params = {};

// -> WORLD
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const size = { width: window.innerWidth, height: window.innerHeight };

// -> MESHES
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0,
    roughness: 5,
    side: THREE.DoubleSide,
  })
);
floor.receiveShadow = true;
floor.rotation.x = Math.PI / -2;
scene.add(floor);

// -> LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.bottom = 7;
directionalLight.shadow.camera.right = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// -> CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// -> RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.shadowMap = THREE.PCFSoftShadowMap;
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

// -> CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

// -> GUI
const gui = new GUI();

// -> TICKER
const clock = new THREE.Clock();
let prevTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// -> EVENT LISTENERS
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
