import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { PlaneGeometry } from 'three';

// --> BAKED SHADOW TEXTURES
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// -> Object shadow settings
sphere.castShadow = true;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
// IMPORTANT: this method works only for static projects because
// the shadows will not be dynamic
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshBasicMaterial({ map: bakedShadow })
// );
// -> Object shadow settings
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(sphere, plane);
// --> PLANE FOR DYNAMIC BACKED SPHERE SHADOW
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);
sphereShadow.rotation.x = Math.PI / -2;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// IMPORTANT: Only Point Light, Directional Light and Spot Light support shadows
// --> DIRECTIONAL LIGHT
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
// -> Light shadow settings and shadow camera helper
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.fromArray([1024, 1024]);
directionalLight.position.set(2, 2, -1);
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.radius = 10; // -> shadow blur (not with PCFSoftShadowMap algo)
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLight);
scene.add(directionalLightCameraHelper);

// --> SPOT LIGHT
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
spotLight.shadow.mapSize.fromArray([1024, 1024]);
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);
scene.add(spotLight);
scene.add(spotLight.target);

// --> POINT LIGHT
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
pointLight.shadow.mapSize.fromArray([1024, 1024]);
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightHelper);
pointLightHelper.visible = false;
scene.add(pointLight);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const gui = new GUI();
const params = {
  animateSphere: true,
};
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'metalness').min(0).max(1).step(0.001);
materialFolder.add(material, 'roughness').min(0).max(1).step(0.001);
materialFolder.close();
const sphereFolder = gui.addFolder('Sphere');
sphereFolder.add(sphere.position, 'x').min(-5).max(5);
sphereFolder.add(sphere.position, 'y').min(0).max(5);
sphereFolder.add(sphere.position, 'z').min(-5).max(5);
sphereFolder.add(params, 'animateSphere');
sphereFolder.close();
const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1);
ambientLightFolder.close();
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.add(directionalLight.position, 'x').min(-5).max(5);
directionalLightFolder.add(directionalLight.position, 'y').min(-5).max(5);
directionalLightFolder.add(directionalLight.position, 'z').min(-5).max(5);
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(1);
directionalLightFolder.addColor(directionalLight, 'color');
directionalLightFolder
  .add(directionalLightCameraHelper, 'visible')
  .name('Helper Show/Hide');
directionalLightFolder.close();
const spotLightFolder = gui.addFolder('Spot Light');
spotLightFolder.add(spotLight.position, 'x').min(-5).max(5);
spotLightFolder.add(spotLight.position, 'y').min(-5).max(5);
spotLightFolder.add(spotLight.position, 'z').min(-5).max(5);
spotLightFolder
  .add(spotLight.target.position, 'x')
  .min(-5)
  .max(5)
  .name('target x');
spotLightFolder
  .add(spotLight.target.position, 'y')
  .min(-5)
  .max(5)
  .name('target y');
spotLightFolder
  .add(spotLight.target.position, 'z')
  .min(-5)
  .max(5)
  .name('target z');
spotLightFolder.add(spotLight, 'distance').min(0).max(10);
spotLightFolder.add(spotLight, 'decay').min(0).max(10);
spotLightFolder.add(spotLight, 'intensity').min(0).max(1);
spotLightFolder.addColor(spotLight, 'color');
spotLightFolder.add(spotLightCameraHelper, 'visible').name('Helper Show/Hide');
spotLightFolder.close();
const pointLightFolder = gui.addFolder('Point Light');
pointLightFolder.add(pointLight.position, 'x').min(-5).max(5);
pointLightFolder.add(pointLight.position, 'y').min(-5).max(5);
pointLightFolder.add(pointLight.position, 'z').min(-5).max(5);
pointLightFolder.add(pointLight, 'intensity').min(0).max(1);
pointLightFolder.addColor(pointLight, 'color');
pointLightFolder.add(pointLightHelper, 'visible').name('Helper Show/Hide');
pointLightFolder.close();

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
// -> enable shadow maps
// renderer.shadowMap.enabled = true;
renderer.shadowMap.enabled = false;
// IMPORTANT: there are four algorithms that can be applied to shadow maps
// BasicShadowMap - performant but low quality
// PCFShadowMap (default)
// PCFSoftShadowMap - less performant but softer edges
// VSMShadowMap - less performant, more constraints, unexpected results
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  if (params.animateSphere) {
    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
    sphere.position.z = Math.sin(elapsedTime) * 1.5;

    sphereShadow.position.x = sphere.position.x;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.4;
    sphereShadow.position.z = sphere.position.z;
  }
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
