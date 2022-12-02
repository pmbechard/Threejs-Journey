import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import gsap from 'gsap';
import { PlaneGeometry, SphereGeometry } from 'three';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// --> TEXTURES
const textureLoaderManager = new THREE.LoadingManager();
textureLoaderManager.onStart = () => console.log('Loading started');
textureLoaderManager.onProgress = () => console.log('Loading in progress');
textureLoaderManager.onLoad = () => console.log('Loading complete');
textureLoaderManager.onError = () => console.log('Loading error');

const textureLoader = new THREE.TextureLoader(textureLoaderManager);

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/3.png');
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
gradientTexture.generateMipmaps = false;

// --> MESH BASIC MATERIAL
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// -> Colors
// material.color.set('#ff00ff');
// material.color = new THREE.Color('pink');
// material.color = new THREE.Color('#ff00ff');
// material.color = new THREE.Color('rgb(255, 120, 80)');
// material.color = new THREE.Color(0xffff00);
// -> Opacity
// material.opacity = 0.5;
// material.transparent = true;
// -> Alpha Mapping
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;
// -> Backface Culling
// material.side = THREE.DoubleSide;

// --> MESH NORMAL MATERIAL
// -> Usually used for debugging normals
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// --> MESH MATCAP MATERIAL
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// --> MESH DEPTH MATERIAL
// const material = new THREE.MeshDepthMaterial();

// --> MESH LAMBERT MATERIAL
// const material = new THREE.MeshLambertMaterial();

// --> MESH PHONG MATERIAL
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color(0x00ff00);

// --> MESH TOON MATERIAL
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// material.gradientMap = gradientTexture;

// --> MESH STANDARD MATERIAL
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 1;
// material.metalness = 0;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// --> MESH PHYSICAL MATERIALS (same as above but with clear coat)

// --> ENVIRONMENT MAP
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/4/px.png',
  '/textures/environmentMaps/4/nx.png',
  '/textures/environmentMaps/4/py.png',
  '/textures/environmentMaps/4/ny.png',
  '/textures/environmentMaps/4/pz.png',
  '/textures/environmentMaps/4/nz.png',
]);

const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 0;
material.envMap = environmentMapTexture;

// --> LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const sphereMesh = new THREE.Mesh(new SphereGeometry(0.5, 64, 64), material);
sphereMesh.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphereMesh.geometry.attributes.uv.array, 2)
);

const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(0.8, 0.1, 64, 128),
  material
);
torusMesh.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(torusMesh.geometry.attributes.uv.array, 2)
);
const planeMesh = new THREE.Mesh(new PlaneGeometry(4, 4, 100, 100), material);
planeMesh.rotation.x = Math.PI / -2;
planeMesh.position.y = -1;
planeMesh.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(planeMesh.geometry.attributes.uv.array, 2)
);

scene.add(sphereMesh, planeMesh, torusMesh);

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.0001,
  100
);
camera.position.z = 5;
camera.position.y = 1;
camera.lookAt(sphereMesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const gui = new GUI();
// gui.addColor(material, 'color').name('Colour');
gui.add(material, 'roughness').name('Roughness').min(0).max(1);
gui.add(material, 'metalness').name('Metalness').min(0).max(1);
gui.add(material, 'aoMapIntensity').name('AO Map Intensity').min(0).max(10);
gui
  .add(material, 'displacementScale')
  .name('Displacement Scale')
  .min(0)
  .max(0.1);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

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

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphereMesh.rotation.y = 0.1 * elapsedTime;
  torusMesh.rotation.y = 0.1 * elapsedTime;

  sphereMesh.rotation.x = 0.1 * elapsedTime;
  torusMesh.rotation.x = 0.1 * elapsedTime;

  planeMesh.rotation.z = 0.1 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
