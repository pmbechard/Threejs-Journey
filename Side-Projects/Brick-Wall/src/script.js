import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import * as CANNON from 'cannon-es';

// --> DEBUG PARAMS
const params = {
  gravity: -1,
  atmosphereColour: 0x001111,
  reset: () => {
    for (const obj of objectsToUpdate) {
      obj.body.removeEventListener('collide', playHitSound);
      world.removeBody(obj.body);
      scene.remove(obj.mesh);
    }
    objectsToUpdate.splice(0, objectsToUpdate.length);
    for (const pos of brickPositions) {
      createBrick(pos);
    }
  },
};

// --> WORLD
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const world = new CANNON.World();
world.gravity.set(0, params.gravity, 0);
world.allowSleep = true;
world.broadphase = new CANNON.SAPBroadphase(world);
const fog = new THREE.Fog(params.atmosphereColour, 0.1, 20);
scene.fog = fog;

// --> OBJECT INTERACTIONS
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// --> TEXTURES
const textureLoader = new THREE.TextureLoader();
const groundColor = textureLoader.load('/textures/ground/basecolor.jpg');
groundColor.repeat.x = 20;
groundColor.repeat.y = 20;
groundColor.wrapS = THREE.RepeatWrapping;
groundColor.wrapT = THREE.RepeatWrapping;
const groundAO = textureLoader.load('/textures/ground/ambientOcclusion.jpg');
const groundHeight = textureLoader.load('/textures/ground/height.png');
const groundNormal = textureLoader.load('/textures/ground/normal.jpg');
const groundRoughness = textureLoader.load('/textures/ground/roughness.jpg');
const groundMetallic = textureLoader.load('/textures/ground/metallic.jpg');

const brickColor = textureLoader.load('/textures/brick/basecolor.jpg');
brickColor.generateMipmaps = false;
const brickAO = textureLoader.load('/textures/brick/ambientOcclusion.jpg');
const brickHeight = textureLoader.load('/textures/brick/height.png');
const brickNormal = textureLoader.load('/textures/brick/normal.jpg');
const brickRoughness = textureLoader.load('/textures/brick/roughness.jpg');
const brickMetalness = textureLoader.load('/textures/brick/metallic.jpg');
const brickEmissive = textureLoader.load('/textures/brick/emissive.jpg');

const ballColor = textureLoader.load('/textures/ball/basecolor.jpg');
ballColor.generateMipmaps = false;
const ballAO = textureLoader.load('/textures/ball/ambientOcclusion.jpg');
const ballHeight = textureLoader.load('/textures/ball/height.png');
const ballNormal = textureLoader.load('/textures/ball/normal.jpg');
const ballMetalness = textureLoader.load('/textures/ball/metallic.jpg');

// --> SOUNDS
const hitSound = new Audio('/sounds/hit.mp3');
const soundClock = new THREE.Clock();
let prevPlaySound = 0;
const playHitSound = (collision) => {
  const elapsedTime = soundClock.getElapsedTime();
  const deltaTime = elapsedTime - prevPlaySound;
  if (deltaTime < 0.15) return;
  prevPlaySound = elapsedTime;
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength < 0.5) return;
  const bodyPos = [
    collision.body.position.x,
    collision.body.position.y,
    collision.body.position.z,
  ];
  const targetPos = [
    collision.target.position.x,
    collision.target.position.y,
    collision.target.position.z,
  ];
  const distanceFromOrigin = Math.max(...bodyPos, ...targetPos);
  if (distanceFromOrigin > 20) return;
  const distanceFactor = Math.min(1, 1 - distanceFromOrigin / 100);
  hitSound.volume = Math.min(
    1,
    collision.contact.getImpactVelocityAlongNormal() / 20 + distanceFactor * 0.5
  );
  hitSound.currentTime = 0.05;
  hitSound.playbackRate = 0.75;
  hitSound.play();
};

// --> MESHES AND BODIES
// -> GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({
    map: groundColor,
    roughnessMap: groundRoughness,
    aoMap: groundAO,
    normalMap: groundNormal,
    metalnessMap: groundMetallic,
  })
);
ground.receiveShadow = true;
ground.rotation.x = -Math.PI * 0.5;
scene.add(ground);

const groundBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, 0, 0),
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(groundBody);

// -> BRICKS
const objectsToUpdate = [];
const brickPositions = [
  { x: 1, y: 0.5, z: -2.1 },
  { x: 1, y: 0.5, z: -0 },
  { x: 1, y: 0.5, z: 2.1 },
  { x: 1, y: 1.5, z: -1.05 },
  { x: 1, y: 1.5, z: 1.05 },
  { x: 1, y: 2.5, z: -2.1 },
  { x: 1, y: 2.5, z: -0 },
  { x: 1, y: 2.5, z: 2.1 },
  { x: 1, y: 3.5, z: -1.05 },
  { x: 1, y: 3.5, z: 1.05 },
];
const brickGeometry = new THREE.BoxGeometry(1, 1, 2);

const brickMaterial = new THREE.MeshStandardMaterial({
  map: brickColor,
  aoMap: brickAO,
  normalMap: brickNormal,
  roughnessMap: brickRoughness,
  metalnessMap: brickMetalness,
  transparent: true,
  displacementScale: 0.05,
  emissiveMap: brickEmissive,
  emissive: 0x00ffff,
  emissiveIntensity: 5,
});
const createBrick = (position) => {
  // THREE Mesh
  const mesh = new THREE.Mesh(brickGeometry, brickMaterial);
  mesh.position.set(position.x + Math.random() / 5, position.y, position.z);
  mesh.castShadow = true;
  scene.add(mesh);

  const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 1));
  const body = new CANNON.Body({
    mass: 3,
    shape,
  });
  body.position.copy(position);
  body.addEventListener('collide', playHitSound);
  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
};
for (const pos of brickPositions) {
  createBrick(pos);
}

// -> BALL
const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: ballColor,
  aoMap: ballAO,
  metalnessMap: ballMetalness,
  normalMap: ballNormal,
  displacementMap: ballHeight,
  displacementScale: 0.02,
});

const shootBall = () => {
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(-10, Math.random() * 4, (Math.random() - 0.5) * 4);
  scene.add(sphereMesh);

  const sphereShape = new CANNON.Sphere(0.25);
  const sphereBody = new CANNON.Body({
    mass: 1,
    shape: sphereShape,
  });
  sphereBody.position.copy(sphereMesh.position);
  world.addBody(sphereBody);
  sphereBody.addEventListener('collide', playHitSound);
  objectsToUpdate.push({ mesh: sphereMesh, body: sphereBody });
  sphereBody.applyLocalForce(
    new CANNON.Vec3(1000, 0, 0),
    new CANNON.Vec3(-0.5, 0, 0)
  );
};

// --> SIZE
const size = { width: window.innerWidth, height: window.innerHeight };

// --> CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  100
);
camera.position.set(-8, 2, 3);
scene.add(camera);

// --> LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.position.set(-1, 1, 1);
directionalLight.receiveShadow = true;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
scene.add(directionalLight);

// --> CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> GUI
const gui = new GUI();
gui
  .add(params, 'gravity')
  .min(-15)
  .max(0)
  .onChange(() => {
    world.gravity.set(0, params.gravity, 0);
  });
gui.addColor(params, 'atmosphereColour').onChange(() => {
  renderer.setClearColor(params.atmosphereColour);
  fog.color.set(params.atmosphereColour);
});
gui.add(params, 'reset');

// --> RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(params.atmosphereColour);
renderer.render(scene, camera);

// --> TICK
const clock = new THREE.Clock();
let prevTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);
  for (const obj of objectsToUpdate) {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
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

window.addEventListener('keypress', (e) => {
  if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
  else if (e.code === 'Space') shootBall();
});
