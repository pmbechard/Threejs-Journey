import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/gold.png');
// --> LOADING FONTS
const fontLoader = new FontLoader();
let text;
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Peyton Bechard', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 16);
  const sphereMaterial = new THREE.MeshMatcapMaterial({
    matcap: textureLoader.load('/textures/matcaps/3.png'),
  });
  for (let i = 0; i < 150; i++) {
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.x = (Math.random() - 0.5) * 10;
    sphereMesh.position.y = (Math.random() - 0.5) * 10;
    sphereMesh.position.z = (Math.random() - 0.5) * 10;
    const scale = Math.random();
    sphereMesh.scale.fromArray([scale, scale, scale]);

    scene.add(sphereMesh);
  }
});
const size = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000
);
camera.position.x = -1;
camera.position.y = -0.5;
camera.position.z = 3;
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});
scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const gui = new GUI();
gui.hide();

window.addEventListener('keydown', (e) => {
  if (e.key === 'h') gui._hidden ? gui.show() : gui.hide();
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  try {
    text.rotation.y = 0.2 * elapsedTime;
  } catch (e) {}
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
