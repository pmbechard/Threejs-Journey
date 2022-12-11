import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Meshes
const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const sphere1 = new THREE.Mesh(
  sphereGeometry,
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
sphere1.position.x = -2;
const sphere2 = new THREE.Mesh(
  sphereGeometry,
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
const sphere3 = new THREE.Mesh(
  sphereGeometry,
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
sphere3.position.x = 2;
scene.add(sphere1, sphere2, sphere3);

// --> RAYCASTER
const raycaster = new THREE.Raycaster();

// -> Basic Setup
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);
// const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
// console.log(intersects); // to log the objects that the ray casts through

// -> Cursor Listener
const cursor = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
  cursor.x = (e.clientX / size.width) * 2 - 1;
  cursor.y = -(e.clientY / size.height) * 2 + 1;
});

// -> Click event
window.addEventListener('click', (e) => {
  if (currentIntersect) {
    console.log('obj clicked');
    console.log(currentIntersect.object);
    currentIntersect.object.geometry.dispose();
    currentIntersect.object.material.dispose();
    scene.remove(currentIntersect.object);
    currentIntersect = null;
  }
});

// Size
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

// -> Witness to see current intersections for enter/exit events
let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  sphere2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  sphere3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // -> Testing ray intersections on each frame
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);
  // const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
  // for (const sphere of [sphere1, sphere2, sphere3])
  //   sphere.material.color.set('#ff0000');
  // for (const sphere of intersects) {
  //   sphere.object.material.color.set('#0000ff');
  // }

  // -> Casting a ray based on the cursor
  raycaster.setFromCamera(cursor, camera);
  for (const sphere of [sphere1, sphere2, sphere3])
    sphere.material.color.set('#ff0000');
  const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);
  for (const sphere of intersects) sphere.object.material.color.set('#0000ff');

  // -> Notifying mouseenter/mouseleave events on three.js objects
  if (intersects.length) {
    if (currentIntersect === null) console.log('mouseenter');
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) console.log('mouseleave');
    currentIntersect = null;
  }

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
