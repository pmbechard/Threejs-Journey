import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import gsap from 'gsap';

// --> TEXTURES
// -> Loading Manager for handling progression of all assets
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log('Loading started');
loadingManager.onProgress = () => console.log('Loading in progress');
loadingManager.onLoad = () => console.log('Loading complete');
loadingManager.onError = () => console.log('Loading error');

// -> Texture loading and converting from images
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/door/color.jpg');
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png');
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// -> Transforming a texture
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
// colorTexture.rotation = Math.PI / 4;

// -> Filtering and MipMapping
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false; // IMPORTANT: Mipmaps are unnecessary when using NearestFilter

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
const size = { width: window.innerWidth, height: innerHeight };
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.0001,
  100
);
camera.position.z = 3;
scene.add(camera);

window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const gui = new GUI();
const parameters = {
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 5,
      x: mesh.rotation.x + Math.PI * 2,
      y: mesh.rotation.y + Math.PI * 2,
      z: mesh.rotation.z + Math.PI * 2,
    });
  },
};
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(mesh.position, 'x').name('x').min(-3).max(3);
cubeFolder.add(mesh.position, 'y').name('y').min(-3).max(3);
cubeFolder.add(mesh.position, 'z').name('z').min(-3).max(3);
cubeFolder.addColor(material, 'color').name('Colour');
cubeFolder.add(mesh, 'visible').name('Show/Hide');
cubeFolder.add(material, 'wireframe').name('Wireframe On/Off');
cubeFolder.add(parameters, 'spin').name('Spin');

window.addEventListener('keydown', (e) => {
  if (e.key === 'h') gui._hidden ? gui.show() : gui.hide();
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
