import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

// --> Loaders
const textureLoader = new THREE.TextureLoader();
// -> Door Textures
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
// -> Brick Textures
const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const brickAmbientOcclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
);
const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const brickRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
);
// -> Grass Textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
);
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load(
  '/textures/grass/roughness.jpg'
);
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

// -> Roof Textures
// const roofColorTexture = textureLoader.load('/textures/roof/color.jpg');
const roofAmbientOcclusionTexture = textureLoader.load(
  '/textures/roof/ambientOcclusion.jpg'
);
const roofNormalTexture = textureLoader.load('/textures/roof/normal-2.jpg');
const roofRoughnessTexture = textureLoader.load('/textures/roof/roughness.jpg');
roofAmbientOcclusionTexture.repeat.set(8, 8);
roofNormalTexture.repeat.set(8, 8);
roofRoughnessTexture.repeat.set(8, 8);
roofAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
roofAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;
roofRoughnessTexture.wrapS = THREE.RepeatWrapping;
roofRoughnessTexture.wrapT = THREE.RepeatWrapping;

// --> Scene Settings
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const sizes = { width: window.innerWidth, height: window.innerHeight };
// -> Fog(color, near, far)
const fog = new THREE.Fog('#262837', 0.01, 15);
scene.fog = fog;

// --> Meshes
// -> House Group
const house = new THREE.Group();
scene.add(house);

// -> House
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = walls.geometry.parameters.height / 2;
house.add(walls);

// -> Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.25, 2, 4),
  new THREE.MeshStandardMaterial({
    // map: roofColorTexture,
    color: '#b35f45',
    aoMap: roofAmbientOcclusionTexture,
    normalMap: roofNormalTexture,
  })
);
roof.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(roof.geometry.attributes.uv.array, 2)
);
roof.position.y =
  walls.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// -> Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = door.geometry.parameters.height / 2 - 0.1;
door.position.z = walls.geometry.parameters.depth / 2 + 0.01;
house.add(door);

// -> Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
house.add(bush1, bush2, bush3, bush4);

// -> Graves Group
const graves = new THREE.Group();
scene.add(graves);

// -> Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 20; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 5 + 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  grave.position.set(x, grave.geometry.parameters.height / 2 - 0.1, z);
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.8;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}

// -> Ground
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = Math.PI / -2;
scene.add(floor);

// --> Lights
// -> Ambient Light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
scene.add(ambientLight);

// -> Moon Light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

// -> Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(
  0,
  walls.geometry.parameters.height - 0.2,
  walls.geometry.parameters.depth / 2 + 0.7
);
house.add(doorLight);

// --> Ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost1, ghost2, ghost3);

// --> Cameras
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.fromArray([4, 2, 5]);

// --> Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> GUI
const gui = new GUI();
gui.hide();
const lightsFolder = gui.addFolder('Lights');
lightsFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(1)
  .name('Ambient Intensity');
lightsFolder.add(moonLight, 'intensity').min(0).max(1).name('Moon Intensity');
lightsFolder.add(moonLight.position, 'x').min(-5).max(5).name('Moon x');
lightsFolder.add(moonLight.position, 'y').min(-5).max(5).name('Moon y');
lightsFolder.add(moonLight.position, 'z').min(-5).max(5).name('Moon z');
lightsFolder.add(doorLight, 'intensity').min(0).max(10).name('Door Intensity');
lightsFolder.addColor(doorLight, 'color').name('Door Colour');
lightsFolder.close();
const fogFolder = gui.addFolder('Fog');
fogFolder.add(fog, 'near').min(0).max(10);
fogFolder.add(fog, 'far').min(0).max(20);
fogFolder.close();
const ghostFolder = gui.addFolder('Ghosts');
ghostFolder.addColor(ghost1, 'color').name('Ghost 1');
ghostFolder.addColor(ghost2, 'color').name('Ghost 2');
ghostFolder.addColor(ghost3, 'color').name('Ghost 3');
ghostFolder.close();

// --> Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
// -> Set Clear Colour
renderer.setClearColor('#262837');
renderer.render(scene, camera);

// --> Shadows
renderer.shadowMap.enabled = true;
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost2.castShadow = true;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --> Ticker
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = elapsedTime * -0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = elapsedTime * -0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 0.5);

  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
};
tick();

// --> Event Listeners
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'h') gui._hidden ? gui.show() : gui.hide();
});
