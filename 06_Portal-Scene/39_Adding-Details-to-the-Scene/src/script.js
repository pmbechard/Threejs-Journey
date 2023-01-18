import './style.css';
import GUI from 'lil-gui';
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import firefliesVertexShader from './shaders/fireflies/vertex.glsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

// --> GUI
const debugObj = {};
const gui = new GUI({
  width: 400,
});
gui.hide();
window.addEventListener('keypress', (e) => {
  if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
});

// --> SCENE
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// --> LOADERS
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

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

// --> SIZES AND RESIZING
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

  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
});

// --> CAMERA
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

// --> Animation function
function animateCamera() {
  // Reset starting location
  gsap.to(camera.position, { x: 0, y: 0.8, z: 2.5, duration: 0.1 });
  gsap.to(camera.rotation, { x: -Math.PI / 16, y: 0, duration: 0.1 });
  const infoCard = document.getElementById('info-card');
  infoCard.style.bottom = '-200vh';
  infoCard.style.display = 'none';

  // Move forward
  gsap.to(camera.position, { z: -1.5, delay: 0.2, duration: 15, ease: 'sine' });

  // Look right, left, up
  gsap.to(camera.rotation, {
    y: -Math.PI / 4,
    delay: 1,
    duration: 2,
    ease: 'power1.inOut',
  });
  gsap.to(camera.rotation, {
    y: Math.PI / 4,
    delay: 3,
    duration: 2,
    ease: 'power1.inOut',
  });
  gsap.to(camera.rotation, {
    y: 0,
    delay: 5,
    duration: 2,
    ease: 'power1.inOut',
  });
  gsap.to(camera.rotation, {
    x: Math.PI / 10,
    delay: 6,
    duration: 3,
    ease: 'power1.inOut',
  });

  // Stairs
  gsap.to(camera.position, {
    y: 1.2,
    delay: 8,
    duration: 3,
    ease: 'power2.inOut',
  });

  // Show HTML Card
  gsap.to('#info-card', { display: 'flex', delay: 11 });
  gsap.to('#info-card', {
    bottom: '0',
    delay: 12,
    duration: 2,
    ease: 'power1.inOut',
  });
}
animateCamera();
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', () => animateCamera());

// --> RENDERER
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

// --> TICKER
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // -> For fireflies Animation
  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalMaterial.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};
tick();
