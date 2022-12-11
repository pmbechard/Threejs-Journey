import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const params = {
  atmosphereColour: 0xb7b7b7,
  floorColour: 0xffffff,
  snowSize: 0.006,
  snowDensity: 100000,
  snowSpeed: 0.001,
  snowRotation: 0.0005,
};

// --> SNOW

let snowGeometry1 = null;
let snowMaterial1 = null;
let snow1 = null;
let snowGeometry2 = null;
let snowMaterial2 = null;
let snow2 = null;
const generateSnow = (init, id) => {
  if (id === 1) {
    if (snowGeometry1) snowGeometry1.dispose();
    if (snowMaterial1) snowMaterial1.dispose();
    if (snow1) scene.remove(snow1);
  } else {
    if (snowGeometry2) snowGeometry2.dispose();
    if (snowMaterial2) snowMaterial2.dispose();
    if (snow2) scene.remove(snow2);
  }

  const snowGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.snowDensity * 3);
  for (let i = 0; i < params.snowDensity; i++) {
    const iCubed = i * 3;
    positions[iCubed + 0] = (Math.random() - 0.5) * 10;
    if (init) positions[iCubed + 1] = Math.random() * 10;
    else positions[iCubed + 1] = Math.random() * 10 + 10;
    positions[iCubed + 2] = (Math.random() - 0.5) * 10;
  }
  snowGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );
  const snowMaterial = new THREE.PointsMaterial({
    alphaMap: snowTexture,
    size: params.snowSize,
    sizeAttenuation: true,
    alphaTest: 0.001,
    transparent: true,
    depthWrite: false,
  });
  const snow = new THREE.Points(snowGeometry, snowMaterial);
  snow.castShadow = true;

  if (id === 1) {
    snowGeometry1 = snowGeometry;
    snowMaterial1 = snowMaterial;
    snow1 = snow;
    scene.add(snow1);
  } else {
    snowGeometry2 = snowGeometry;
    snowMaterial2 = snowMaterial;
    snow2 = snow;
    scene.add(snow2);
  }
};
const textureLoader = new THREE.TextureLoader();
const snowTexture = textureLoader.load('/textures/1.png', () => {
  generateSnow(false, 2);
  generateSnow(true, 1);
});

// --> SNOWMAN
const snowman = new THREE.Group();
const snowmanMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const snowmanBottomGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const snowmanBottomMesh = new THREE.Mesh(
  snowmanBottomGeometry,
  snowmanMaterial
);
snowmanBottomMesh.position.y = 0.05;

const snowmanMediumGeometry = new THREE.SphereGeometry(0.08, 32, 32);
const snowmanMediumMesh = new THREE.Mesh(
  snowmanMediumGeometry,
  snowmanMaterial
);
snowmanMediumMesh.position.y = 0.18;

const snowmanTopGeometry = new THREE.SphereGeometry(0.06, 32, 32);
const snowmanTopMesh = new THREE.Mesh(snowmanTopGeometry, snowmanMaterial);
snowmanTopMesh.position.y = 0.3;

const snowmanNose = new THREE.Mesh(
  new THREE.ConeGeometry(0.01, 0.04, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffaa00 })
);
snowmanNose.position.y = 0.3;
snowmanNose.position.z = 0.08;
snowmanNose.rotation.x = Math.PI / 2;

const eyeMaterial = new THREE.MeshStandardMaterial({
  color: 0x000000,
  roughness: 0,
});
const snowmanEyeR = new THREE.Mesh(
  new THREE.SphereGeometry(0.01, 8, 8),
  eyeMaterial
);
snowmanEyeR.position.x = -0.02;
snowmanEyeR.position.y = 0.32;
snowmanEyeR.position.z = 0.05;

const snowmanEyeL = new THREE.Mesh(
  new THREE.SphereGeometry(0.01, 8, 8),
  eyeMaterial
);
snowmanEyeL.position.x = 0.02;
snowmanEyeL.position.y = 0.32;
snowmanEyeL.position.z = 0.05;

snowmanBottomMesh.castShadow = true;
snowmanMediumMesh.castShadow = true;
snowmanTopMesh.castShadow = true;
snowmanNose.castShadow = true;

const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const snowmanHatBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.08, 0.08, 0.005, 32, 32),
  hatMaterial
);
snowmanHatBase.position.y = 0.35;

const snowmanHatTop = new THREE.Mesh(
  new THREE.CylinderGeometry(0.055, 0.05, 0.06, 32, 32),
  hatMaterial
);
snowmanHatTop.position.y = 0.38;

const snowmanHatRibbon = new THREE.Mesh(
  new THREE.CylinderGeometry(0.055, 0.055, 0.01, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x660000 })
);
snowmanHatRibbon.position.y = 0.36;

snowman.add(
  snowmanBottomMesh,
  snowmanMediumMesh,
  snowmanTopMesh,
  snowmanNose,
  snowmanEyeR,
  snowmanEyeL,
  snowmanHatBase,
  snowmanHatTop,
  snowmanHatRibbon
);
snowman.rotation.y = Math.PI / -8;
scene.add(snowman);

// --> ATMOSPHERE

const fog = new THREE.Fog(params.atmosphereColour, 0.1, 5);
scene.fog = fog;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    color: params.floorColour,
    side: THREE.DoubleSide,
    alphaTest: 0.001,
    shadowSide: THREE.DoubleSide,
  })
);
floor.receiveShadow = true;
floor.rotation.x = Math.PI / -2;
scene.add(floor);

// --> LIGHTS

const ambientLight = new THREE.AmbientLight(0xdddddd, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffdd, 0.1);
directionalLight.castShadow = true;
directionalLight.position.x = 5;
directionalLight.position.y = 5;
directionalLight.distance = 10;
directionalLight.angle = 0.1;
directionalLight.penumbra = 1;
scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight
// );
// scene.add(directionalLightHelper);

// --> CAMERA

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.01,
  1000
);
camera.position.z = 1.5;
camera.position.y = 0.3;
scene.add(camera);

// --> CONTROLS

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> GUI
const gui = new GUI();
gui.addColor(floor.material, 'color').name('Platform Colour');
gui
  .addColor(params, 'atmosphereColour')
  .name('World Colour')
  .onFinishChange(() => {
    const newAtmosphereColour = new THREE.Color(params.atmosphereColour);
    fog.color = newAtmosphereColour;
    renderer.setClearColor(newAtmosphereColour);
  });
gui.add(params, 'snowSpeed').min(0.001).max(0.01);
gui.add(params, 'snowRotation').min(0).max(0.01);

// --> RENDERER

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setClearColor(params.atmosphereColour);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

// --> TICKER

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  if (snow1) {
    snow1.position.y -= params.snowSpeed;
    snow1.rotation.y -= params.snowRotation;
    if (snow1.position.y < -10) snow1.position.y = 10;
  }
  if (snow2) {
    snow2.position.y -= params.snowSpeed;
    snow2.rotation.y -= params.snowRotation;
    if (snow2.position.y < -20) snow2.position.y = 0;
  }
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// --> EVENT LISTENERS

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
