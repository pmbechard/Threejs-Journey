import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const fog = new THREE.Fog(0x111111, 0.1, 25);
scene.fog = fog;

const sphere = new THREE.Points(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  })
);
sphere.castShadow = true;
scene.add(sphere);

const innerSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
  })
);
innerSphere.castShadow = true;
scene.add(innerSphere);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.95, 2.4, 16, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.03,
    wireframe: true,
    depthWrite: false,
  })
);
cone.position.y = -1.5;
cone.rotation.x = Math.PI;
cone.receiveShadow = true;
scene.add(cone);

// const innerCone = new THREE.Mesh(
//   new THREE.ConeGeometry(0.95, 2.4, 16, 1, true),
//   new THREE.MeshStandardMaterial({
//     color: 0x00ffff,
//     transparent: true,
//     opacity: 0.01,
//     depthWrite: false,
//   })
// );
// innerCone.position.y = -1.5;
// innerCone.rotation.x = Math.PI;
// innerCone.receiveShadow = true;
// scene.add(innerCone);

const lightBox = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.2, 1, 12, 12, true),
  new THREE.MeshStandardMaterial({ color: 0x000000 })
);
lightBox.position.y = -2.8;
scene.add(lightBox);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ color: 0x000000 })
);
floor.position.y = -2.8;
floor.rotation.x = Math.PI / -2;
scene.add(floor);

const spotLight = new THREE.SpotLight(0x00ffff, 8);
spotLight.position.y = -4;
spotLight.angle = 0.35;
spotLight.castShadow = true;
spotLight.distance = 10;
spotLight.penumbra = 2;
scene.add(spotLight);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 5;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.01,
  1000
);
camera.position.z = 6;
camera.position.y = -2;
camera.lookAt(cone.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;

const gui = new GUI();
gui.hide();
gui.add(sphere.material, 'size').min(0.001).max(0.1);
gui.addColor(sphere.material, 'color');
gui.add(controls, 'autoRotate');
gui.add(controls, 'autoRotateSpeed').min(0.1).max(20);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setClearColor(0x111111);
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

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
