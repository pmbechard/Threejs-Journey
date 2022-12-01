import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import gsap from 'gsap';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x990099 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
const size = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const gui = new GUI();
const cubeFolder = gui.addFolder('Cube');
cubeFolder.add(mesh.position, 'x').name('x').min(-3).max(3);
cubeFolder.add(mesh.position, 'y').name('y').min(-3).max(3);
cubeFolder.add(mesh.position, 'z').name('z').min(-3).max(3);
cubeFolder.addColor(material, 'color').name('Colour');
cubeFolder.add(material, 'visible').name('Show/Hide');
cubeFolder.add(material, 'wireframe').name('Wireframe On/Off');
const params = {
  spin: () => {
    gsap.to(mesh.rotation, {
      duration: 5,
      x: mesh.rotation.x + Math.PI * 2,
      y: mesh.rotation.y + Math.PI * 2,
    });
  },
};
cubeFolder.add(params, 'spin').name('Spin');
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
  else if (e.key === '0') {
    mesh.position.fromArray([0, 0, 0]);
    camera.position.fromArray([0, 0, 3]);
    camera.lookAt(mesh);
    gui.reset();
  }
});

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
