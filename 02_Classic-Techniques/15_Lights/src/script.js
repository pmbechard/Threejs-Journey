import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// --> LIGHTS

// -> AMBIENT LIGHT (omni-directional uniform lighting)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// -> DIRECTIONAL LIGHT (parallel rays from a specified direction to the world origin)
const directionalLight = new THREE.DirectionalLight(0xffcc00, 0);
directionalLight.position.fromArray([1, 0.25, 0]);
scene.add(directionalLight);

// -> HEMISPHERE LIGHT
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0);
scene.add(hemisphereLight);

// -> POINT LIGHT
const pointLight = new THREE.PointLight(0xff00ff, 0);
pointLight.position.fromArray([1, 0.5, 1]);
scene.add(pointLight);

// -> RECT AREA LIGHT
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 0, 1, 1);
scene.add(rectAreaLight);

// -> SPOT LIGHT
const spotLight = new THREE.SpotLight(0xfff000, 0, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.fromArray([0, 2, 3]);
scene.add(spotLight);
scene.add(spotLight.target); // a reference point for the spotlight to be rotated around

// --> HELPERS
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
hemisphereLightHelper.visible = false;
scene.add(hemisphereLightHelper);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLightHelper.visible = false;
scene.add(pointLightHelper);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.visible = false;
scene.add(spotLightHelper);
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;
scene.add(rectAreaLightHelper);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;
scene.add(sphere, cube, torus, plane);
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> LIGHT PROPERTIES
const gui = new GUI();
const params = {
  rectAreaLookAt: () => rectAreaLight.lookAt(cube.position),
  togglePointLightHelper: () =>
    (pointLightHelper.visible = !pointLightHelper.visible),
  toggleHemisphereLightHelper: () =>
    (hemisphereLightHelper.visible = !hemisphereLightHelper.visible),
  toggleDirectionalLightHelper: () =>
    (directionalLightHelper.visible = !directionalLightHelper.visible),
  toggleSpotLightHelper: () =>
    (spotLightHelper.visible = !spotLightHelper.visible),
  toggleRectAreaLightHelper: () =>
    (rectAreaLightHelper.visible = !rectAreaLightHelper.visible),
};
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'roughness').min(0).max(1);
materialFolder.add(material, 'metalness').min(0).max(1);
materialFolder.close();
const ambientFolder = gui.addFolder('Ambient Light');
ambientFolder.add(ambientLight, 'intensity').min(0).max(1);
ambientFolder.close();
const directionalFolder = gui.addFolder('Directional Light');
directionalFolder.add(directionalLight.position, 'x').min(-5).max(5);
directionalFolder.add(directionalLight.position, 'y').min(-5).max(5);
directionalFolder.add(directionalLight.position, 'z').min(-5).max(5);
directionalFolder.add(directionalLight, 'intensity').min(0).max(1);
directionalFolder.addColor(directionalLight, 'color');
directionalFolder.add(params, 'toggleDirectionalLightHelper');
directionalFolder.close();
const hemisphereFolder = gui.addFolder('Hemisphere Light');
hemisphereFolder.add(hemisphereLight, 'intensity').min(0).max(1);
hemisphereFolder.addColor(hemisphereLight, 'color');
hemisphereFolder.addColor(hemisphereLight, 'groundColor');
hemisphereFolder.add(params, 'toggleHemisphereLightHelper');
hemisphereFolder.close();
const pointFolder = gui.addFolder('Point Light');
pointFolder.add(pointLight.position, 'x').min(-5).max(5);
pointFolder.add(pointLight.position, 'y').min(-5).max(5);
pointFolder.add(pointLight.position, 'z').min(-5).max(5);
pointFolder.add(pointLight, 'intensity').min(0).max(1);
pointFolder.add(pointLight, 'decay').min(0).max(5);
pointFolder.add(pointLight, 'distance').min(0).max(5);
pointFolder.addColor(pointLight, 'color');
pointFolder.add(params, 'togglePointLightHelper');
pointFolder.close();
const rectAreaFolder = gui.addFolder('Rect Area Light');
rectAreaFolder.add(rectAreaLight, 'width').min(0).max(10);
rectAreaFolder.add(rectAreaLight, 'height').min(0).max(10);
rectAreaFolder.add(rectAreaLight.position, 'x').min(-5).max(5);
rectAreaFolder.add(rectAreaLight.position, 'y').min(-5).max(5);
rectAreaFolder.add(rectAreaLight.position, 'z').min(-5).max(5);
rectAreaFolder.add(rectAreaLight.rotation, 'x').min(-5).max(5).name('rotate x');
rectAreaFolder.add(rectAreaLight.rotation, 'y').min(-5).max(5).name('rotate y');
rectAreaFolder.add(rectAreaLight.rotation, 'z').min(-5).max(5).name('rotate z');
rectAreaFolder.add(rectAreaLight, 'intensity').min(0).max(20);
rectAreaFolder.addColor(rectAreaLight, 'color');
rectAreaFolder.add(params, 'rectAreaLookAt');
rectAreaFolder.add(params, 'toggleRectAreaLightHelper');
rectAreaFolder.close();
const spotFolder = gui.addFolder('Spot Light');
spotFolder.add(spotLight.position, 'x').min(-5).max(5);
spotFolder.add(spotLight.position, 'y').min(-5).max(5);
spotFolder.add(spotLight.position, 'z').min(-5).max(5);
spotFolder.add(spotLight.target.position, 'x').min(-5).max(5).name('target x');
spotFolder.add(spotLight.target.position, 'y').min(-5).max(5).name('target y');
spotFolder.add(spotLight.target.position, 'z').min(-5).max(5).name('target z');
spotFolder.add(spotLight, 'distance').min(0).max(20);
spotFolder.add(spotLight, 'angle').min(0).max(Math.PI);
spotFolder.add(spotLight, 'penumbra').min(0).max(1);
spotFolder.add(spotLight, 'decay').min(0).max(10);
spotFolder.add(spotLight, 'intensity').min(0).max(5);
spotFolder.addColor(spotLight, 'color');
spotFolder.add(params, 'toggleSpotLightHelper');
spotFolder.close();

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;
  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // -> Manual Light Helper Update
  spotLightHelper.update();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
