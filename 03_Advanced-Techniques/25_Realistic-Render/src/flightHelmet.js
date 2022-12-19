import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GUI from 'lil-gui';

// GUI
const gui = new GUI();
const guiParams = {
  envMapIntensity: 2.5,
};

// LOADERS
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// SCENE
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = guiParams.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

// ENVIRONMENT MAP
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;
gui
  .add(guiParams, 'envMapIntensity')
  .min(0)
  .max(5)
  .step(0.01)
  .onChange(updateAllMaterials);

// MODELS
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI / 2;
  scene.add(gltf.scene);
  updateAllMaterials();

  gui
    .add(gltf.scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.01)
    .name('rotation');
});

// SIZES
const size = { width: window.innerWidth, height: window.innerHeight };

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.set(4, 1, -4);
scene.add(camera);

// LIGHTS
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);
gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.01)
  .name('lightIntensity');
gui
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.01)
  .name('lightX');
gui
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.01)
  .name('lightY');
gui
  .add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.01)
  .name('lightZ');

// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightCameraHelper);

// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;

renderer.toneMapping = THREE.ReinhardToneMapping;

gui.add(renderer, 'toneMapping', {
  None: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACES: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01);

// TICKER
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// EVENT LISTENERS
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});
window.addEventListener('keypress', (e) => {
  if (e.key.toLowerCase()) gui._hidden ? gui.show() : gui.hide();
});
