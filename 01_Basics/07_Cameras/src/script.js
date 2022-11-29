import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// --> CURSOR
const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

const scene = new THREE.Scene();
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 'yellow' })
);
scene.add(mesh);
const sizes = { width: 800, height: 600 };

// --> CAMERA
// THREE.Camera() is an abstract class - it's not meant to be used directly
// Focus on PerspectiveCamera() and OrthographicCamera()

// -> PERSPECTIVE CAMERA
// PerspectiveCamera(Field of View [45deg-75deg], aspect ratio [width/height], Near cut-off-point, Far cut-off-point)
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

// -> ORTHOGRAPHIC CAMERA
// Without the aspect ratio to calculate left/right, the result looks stretched/squished
// OrthographicCamera(left, right, top, bottom, near, far)
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   aspectRatio * -1,
//   aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

const canvas = document.querySelector('canvas.webgl');

// --> ORBIT CONTROLS
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 2;
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  //   mesh.rotation.y = elapsedTime;

  // -> CAMERA POSITION TO MOUSE
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //   camera.position.y = cursor.y * 5;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //   camera.lookAt(mesh.position);
  // IMPORTANT: THREE.JS HAS BUILT-IN CONTROLS TO ACCOMPLISH THIS AND MUCH MORE SUCH AS ORBIT CONTROLS
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
