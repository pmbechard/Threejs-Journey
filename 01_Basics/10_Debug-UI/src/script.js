import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// --> DEBUG UI
const gui = new GUI({ width: 300 }); // -> width property is optional

// -> Adding Parameters
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(mesh.position, 'x', -3, 3, 0.2).name('Cube X');
cubeFolder.add(mesh.position, 'y').min(-3).max(3).step(0.2).name('Cube Y'); // -> alternative way
cubeFolder.add(mesh.position, 'z', -3, 3, 0.2).name('Cube Z');
cubeFolder.addColor(material, 'color').name('Color');
cubeFolder.add(mesh, 'visible').name('Show/Hide');
cubeFolder.add(material, 'wireframe').name('Wireframe');

// -> Adding Custom Parameters
const parameters = {
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 3,
      y: Math.PI * 2,
      x: Math.PI * 2,
      z: Math.PI * 2,
    });
    mesh.rotation.fromArray([0, 0, 0]);
  },
};
cubeFolder.add(parameters, 'spin').name('Spin');

// -> Show/hide Debug UI
window.addEventListener('keydown', (e) => {
  if (e.key === 'h') gui._hidden ? gui.show() : gui.hide();
});
