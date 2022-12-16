import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
// import CANNON from 'cannon';
import * as CANNON from 'cannon-es';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// -> Sounds
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength < 1.5) return;
  hitSound.volume = Math.random();
  hitSound.currentTime = 0;
  hitSound.play();
};

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  './textures/environmentMaps/0/px.png',
  './textures/environmentMaps/0/nx.png',
  './textures/environmentMaps/0/py.png',
  './textures/environmentMaps/0/ny.png',
  './textures/environmentMaps/0/pz.png',
  './textures/environmentMaps/0/nz.png',
]);

// --> PHYSICS
const params = {
  gravity: -9.82,
  friction: 0.1,
  restitution: 0.7,
  createSphere: () =>
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }),
  createBox: () =>
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }),
  reset: () => {
    for (const obj of objectsToUpdate) {
      obj.body.removeEventListener('collide', playHitSound);
      world.removeBody(obj.body);
      scene.remove(obj.mesh);
    }
    objectsToUpdate.splice(0, objectsToUpdate.length);
  },
};
// -> World
const world = new CANNON.World();
world.gravity.set(0, params.gravity, 0);
// -> Performance Improvements
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
// -> Physics Materials
const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  { friction: params.friction, restitution: params.restitution }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// -> Plane Body
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, 0, 0),
  shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
world.addBody(floorBody);

// --> UTILS
const objectsToUpdate = [];
// -> Sphere Generator
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
const createSphere = (radius, position) => {
  // THREE MESH
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // CANNON PHYSICS BODY
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    shape,
  });
  body.position.copy(position);
  body.addEventListener('collide', playHitSound);
  world.addBody(body);

  objectsToUpdate.push({ mesh, body });
};
createSphere(0.5, { x: 0, y: 3, z: 0 });

// -> Box Generator
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const createBox = (width, height, depth, position) => {
  // THREE MESH
  const mesh = new THREE.Mesh(boxGeometry, sphereMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // PHYSICS BODY
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    shape,
  });
  body.position.copy(position);
  body.addEventListener('collide', playHitSound);
  world.add(body);

  objectsToUpdate.push({ mesh, body });
};

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const ambientLight = new THREE.AmbientLight('#ffffff', 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> GUI
const gui = new GUI();
gui
  .add(params, 'gravity')
  .min(-15)
  .max(0)
  .onFinishChange(() => world.gravity.set(0, params.gravity, 0));
gui
  .add(params, 'friction')
  .min(0)
  .max(1)
  .onFinishChange(() => (defaultContactMaterial.friction = params.friction));
gui
  .add(params, 'restitution')
  .min(0)
  .max(1.5)
  .onFinishChange(
    () => (defaultContactMaterial.restitution = params.restitution)
  );
gui.add(params, 'createSphere');
gui.add(params, 'createBox');
gui.add(params, 'reset');

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

const clock = new THREE.Clock();
let prevTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  // -> Update Physics World
  world.step(1 / 60, deltaTime, 3);
  // -> Update Meshes based on Physics Bodies
  for (const obj of objectsToUpdate) {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  }

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
window.addEventListener('keypress', (e) => {
  if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
});
