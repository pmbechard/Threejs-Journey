import './style.css';
import Experience from './Experience/Experience';

const experience = new Experience(document.querySelector('canvas.webgl'));

// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import GUI from 'lil-gui';

// // GUI
// const gui = new GUI();
// const guiParams = {};

// // LOADERS
// const gltfLoader = new GLTFLoader();
// const textureLoader = new THREE.TextureLoader();
// const cubeTextureLoader = new THREE.CubeTextureLoader();

// // SCENE
// const canvas = document.querySelector('canvas.webgl');
// const scene = new THREE.Scene();

// // UPDATE MATERIALS
// const updateAllMaterials = () => {
//   scene.traverse((child) => {
//     if (
//       child instanceof THREE.Mesh &&
//       child.material instanceof THREE.MeshStandardMaterial
//     ) {
//       child.material.envMapIntensity = guiParams.envMapIntensity;
//       child.material.needsUpdate = true;
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });
// };

// // ENVIRONMENT MAP
// const environmentMap = cubeTextureLoader.load([
//   'textures/environmentMap/px.jpg',
//   'textures/environmentMap/nx.jpg',
//   'textures/environmentMap/py.jpg',
//   'textures/environmentMap/ny.jpg',
//   'textures/environmentMap/pz.jpg',
//   'textures/environmentMap/nz.jpg',
// ]);
// environmentMap.encoding = THREE.sRGBEncoding;
// scene.environment = environmentMap;
// guiParams.envMapIntensity = 0.4;
// gui
//   .add(guiParams, 'envMapIntensity')
//   .min(0)
//   .max(10)
//   .step(0.1)
//   .onChange(updateAllMaterials);

// // MODELS
// let foxMixer = null;
// gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
//   gltf.scene.scale.set(0.02, 0.02, 0.02);
//   scene.add(gltf.scene);

//   foxMixer = new THREE.AnimationMixer(gltf.scene);
//   const foxAction = foxMixer.clipAction(gltf.animations[0]);
//   foxAction.play();

//   updateAllMaterials();
// });

// // FLOOR
// const floorColourTexture = textureLoader.load('/textures/dirt/color.jpg');
// floorColourTexture.encoding = THREE.sRGBEncoding;
// floorColourTexture.repeat.set(1.5, 1.5);
// floorColourTexture.wrapS = THREE.RepeatWrapping;
// floorColourTexture.wrapT = THREE.RepeatWrapping;

// const floorNormalTexture = textureLoader.load('textures/dirt/normal.jpg');
// floorNormalTexture.repeat.set(1.5, 1.5);
// floorNormalTexture.wrapS = THREE.RepeatWrapping;
// floorNormalTexture.wrapT = THREE.RepeatWrapping;

// const floorGeometry = new THREE.CircleGeometry(5, 64);
// const floorMaterial = new THREE.MeshStandardMaterial({
//   map: floorColourTexture,
//   normalMap: floorNormalTexture,
// });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = Math.PI / -2;
// scene.add(floor);

// // LIGHTS
// const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.normalBias = 0.5;
// directionalLight.position.set(3.5, 2, -1.25);
// scene.add(directionalLight);

// gui
//   .add(directionalLight, 'intensity')
//   .min(0)
//   .max(10)
//   .step(0.001)
//   .name('lightIntensity');
// gui
//   .add(directionalLight.position, 'x')
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name('lightX');
// gui
//   .add(directionalLight.position, 'y')
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name('lightY');
// gui
//   .add(directionalLight.position, 'z')
//   .min(-5)
//   .max(5)
//   .step(0.001)
//   .name('lightZ');

// // SIZE
// const size = { width: window.innerWidth, height: window.innerHeight };

// // CAMERA
// const camera = new THREE.PerspectiveCamera(
//   75,
//   size.width / size.height,
//   0.1,
//   100
// );
// camera.position.set(6, 4, 8);
// scene.add(camera);

// // CONTROLS
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// // RENDERER
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.CineonToneMapping;
// renderer.toneMappingExposure = 1.75;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.setClearColor('#211d20');
// renderer.setSize(size.width, size.height);
// renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

// // TICKER
// const clock = new THREE.Clock();
// let prevTime = 0;
// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   const deltaTime = elapsedTime - prevTime;
//   prevTime = elapsedTime;

//   if (foxMixer) {
//     foxMixer.update(deltaTime);
//   }

//   controls.update();
//   renderer.render(scene, camera);
//   window, requestAnimationFrame(tick);
// };
// tick();

// // EVENT LISTENERS
// window.addEventListener('resize', () => {
//   size.width = window.innerWidth;
//   size.height = window.innerHeight;
//   camera.aspect = size.width / size.height;
//   camera.updateProjectionMatrix();
//   renderer.setSize(size.width, size.height);
//   renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
// });
// window.addEventListener('keypress', (e) => {
//   if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
// });
