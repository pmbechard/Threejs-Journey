import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
// --> BUILT-IN GEOMETRIES
// const geometry = new THREE.PlaneGeometry();
// const geometry = new THREE.CircleGeometry();
// const geometry = new THREE.ConeGeometry(5, 20, 32);
// const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
// const geometry = new THREE.RingGeometry(1, 5, 32);
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const geometry = new THREE.TorusKnotGeometry(10, 3, 16, 100);
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// -> Octahedron, Tetrahedron, Icosahedron, Tube, Extrude, Lathe, Text
// -> last three params in BoxGeometry are subdivisions
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

// --> BUFFER GEOMETRY
// -> Create a Float32 array contain 3 vertices at (0,0,0), (0,1,0), and (1,0,0)
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
// -> Convert Float32Array to BufferAttribute by supplying the array and the # of values per vertex
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// -> Apply attribute to BufferGeometry
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute('position', positionsAttribute);

// --> Generate random triangles
const geometry = new THREE.BufferGeometry();
const count = 1000;
const positionsArray = new Float32Array(count * 3 * 3); // -> 3 values and 3 vertices per triangle
for (let i = 0; i < count * 3 * 3; i++)
  positionsArray[i] = (Math.random() - 0.5) * 3;
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 'yellow',
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
const size = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

window.addEventListener('resize', () => {
  size.height = window.innerHeight;
  size.width = window.innerWidth;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
