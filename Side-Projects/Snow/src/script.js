import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const params = {
  atmosphereColour: 0x949494,
  snowSize: 0.002,
  snowDensity: 50000,
};

// --> SNOW

let snowGeometry1 = null;
let snowMaterial1 = null;
let snow1 = null;
let snowGeometry2 = null;
let snowMaterial2 = null;
let snow2 = null;
const generateSnow = (id, init = false) => {
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
    color: '#ffffff',
    size: params.snowSize,
    sizeAttenuation: true,
    alphaTest: 0.001,
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
generateSnow(true, 1);
generateSnow(false, 2);

// --> ATMOSPHERE

const fog = new THREE.Fog(0xb5b5b5, 0.1, 10);
scene.fog = fog;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
    alphaTest: 0.001,
    shadowSide: THREE.DoubleSide,
  })
);
floor.rotation.x = Math.PI / -2;
scene.add(floor);

// --> LIGHTS

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.x = 5;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// --> CAMERA

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.01,
  1000
);
camera.position.z = 3;
camera.position.y = 0.1;
scene.add(camera);

// --> CONTROLS

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> GUI
// TODO: Add params

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
gui
  .add(pointLight, 'intensity')
  .name('Point Light Intensity')
  .min(0)
  .max(20)
  .step(0.1);
gui.add(params, 'snowSize').min(0.01).max(0.5);

// --> RENDERER

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setClearColor(0xb5b5b5);
renderer.render(scene, camera);

// --> TICKER

const clock = new THREE.Clock();
const idTracker = 1;
const tick = () => {
  const elapsedTime = clock.getElapsedTime() * 0.5;
  if (parseFloat(elapsedTime.toFixed(2)) % 11 === 0) {
    generateSnow(idTracker);
    idTracker === 1 ? 2 : 1;
    clock.start();
  }
  snow1.position.y = -elapsedTime;
  snow2.position.y = -elapsedTime;
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
