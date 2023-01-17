import './style.css';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import firefliesVertexShader from './shaders/fireflies/vertex.glsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

/**
 * Base
 */
// Debug
const debugObj = {};
const gui = new GUI({
  width: 400,
});
gui.hide();
window.addEventListener('keypress', (e) => {
  if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// --> TEXTURES
const bakedTexture = textureLoader.load('baked.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

// --> MATERIALS
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// -> Lamp Material
const lampMaterial = new THREE.MeshBasicMaterial({
  color: 0xebd099,
});

// -> Portal Material
debugObj.portalColourStart = '#dfd6ff';
debugObj.portalColourEnd = '#eeeeee';
gui
  .addColor(debugObj, 'portalColourStart')
  .onChange(() =>
    portalMaterial.uniforms.uColourStart.value.set(debugObj.portalColourStart)
  );
gui
  .addColor(debugObj, 'portalColourEnd')
  .onChange(() =>
    portalMaterial.uniforms.uColourEnd.value.set(debugObj.portalColourEnd)
  );

const portalMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColourStart: { value: new THREE.Color(0xdfd6ff) },
    uColourEnd: { value: new THREE.Color(0xeeeeee) },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});

// --> MODEL
gltfLoader.load('portal.glb', (gltf) => {
  const portalMesh = gltf.scene.children.find(
    (child) => child.name === 'Portal'
  );
  portalMesh.material = portalMaterial;

  const lampRightMesh = gltf.scene.children.find(
    (child) => child.name === 'Lamp'
  );
  lampRightMesh.material = lampMaterial;

  const lampLeftMesh = gltf.scene.children.find(
    (child) => child.name === 'Lamp001'
  );
  lampLeftMesh.material = lampMaterial;

  const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked');
  bakedMesh.material = bakedMaterial;

  scene.add(gltf.scene);
});

// --> FIREFLIES
// -> Geometry
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);
for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 2;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random();
}
firefliesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(scaleArray, 1)
);

// -> Material
const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(2, window.devicePixelRatio) },
    uSize: { value: 100 },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  // blending: THREE.AdditiveBlending, // exaggerated result
  depthWrite: false,
});
gui
  .add(firefliesMaterial.uniforms.uSize, 'value')
  .min(1)
  .max(500)
  .step(1)
  .name('Fireflies Size');
// -> Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);

scene.add(fireflies);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.x = 0;
camera.position.y = 0.8;
camera.position.z = 2.5;
camera.rotation.x = -Math.PI / 16;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

debugObj.clearColour = '#000519';
renderer.setClearColor(debugObj.clearColour);
gui
  .addColor(debugObj, 'clearColour')
  .onChange(() => renderer.setClearColor(debugObj.clearColour));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // -> For fireflies Animation
  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalMaterial.uniforms.uTime.value = elapsedTime;

  // Animate camera
  camera.position.x = Math.sin(elapsedTime) * 0.05;
  camera.position.z -= 0.005;
  if (camera.position.z < -1.8) {
    camera.position.x = 0;
    camera.position.y = 0.8;
    camera.position.z = 2.5;
    camera.rotation.x = -Math.PI / 16;
    clock.start();
  }

  if (camera.position.z > 0.65) {
    camera.rotation.y = Math.sin(elapsedTime) * 0.5;
  }

  if (camera.position.z < -0.5) {
    camera.position.y += 0.0025;
  }

  if (camera.position.z < 1) {
    camera.rotation.x += 0.001;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
