import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import GUI from 'lil-gui';

// --> MODEL LOADERS
// -> DRACO-Compressed Files
// IMPORTANT: DRACO files are much lighter and this loading set-up
// can load DRACO and non-DRACO models. It works at a much faster
// pace with DRACO files by using workers and WASM
// IMPORTANT: TO set this up, you must copy the draco folder from
// 'node_modules/three/examples/js/libs/' to the static folder
// IMPORTANT: When to use DRACO: for many geometries - check load/lag time
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/draco/');
// const gltfLoader = new GLTFLoader();
// gltfLoader.setDRACOLoader(dracoLoader);
// gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
//   while (gltf.scene.children.length) scene.add(gltf.scene.children[0]);
//   scene.add(gltf.scene);
// });

// -> Non-DRACO loading
// const gltfLoader = new GLTFLoader();
// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
//   while (gltf.scene.children.length) scene.add(gltf.scene.children[0]);
//   scene.add(gltf.scene);
// });

// -> Animated Model
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let mixer;
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[1]);
  action.play();
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);
});

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
  0.01,
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

  // -> Model Animation
  if (mixer) mixer.update(deltaTime);

  if (camera.position.y < 1) camera.position.y = 1;
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
