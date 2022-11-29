import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

const scene = new THREE.Scene();
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0ff0f0 })
);
scene.add(mesh);
const sizes = { width: 800, height: 600 };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// ANIMATION

// const tick = () => {
//     mesh.rotation.x += 0.01;
//     mesh.rotation.y += 0.01;
//     mesh.rotation.z += 0.01;
//     renderer.render(scene, camera);
//     window.requestAnimationFrame(tick);
//   };

// because of different FPS rates, animations may appear to be
// different speeds on different devices

// SOLUTION 1: ∆time
// let time = Date.now();
// const tick = () => {
//   const currentTime = Date.now();
//   const deltaTime = currentTime - time;
//   time = currentTime;

//   mesh.rotation.x += 0.001 * deltaTime;
//   mesh.rotation.y += 0.001 * deltaTime;
//   mesh.rotation.z += 0.001 * deltaTime;
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// // SOLUTION 2: Clock()
// const clock = new THREE.Clock();
// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   mesh.rotation.x = (elapsedTime * Math.PI) / 2;
//   mesh.rotation.y = (elapsedTime * Math.PI) / 2;
//   mesh.rotation.z = (elapsedTime * Math.PI) / 2;

//   mesh.position.x = Math.sin(elapsedTime);
//   mesh.position.y = Math.cos(-elapsedTime);

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// SOLUTION 3: Using a Library: GSAP
gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: 0, duration: 2, delay: 2 });

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
