import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// --> HOLOGRAM
const hologram = new THREE.Group();

const sphere = new THREE.Points(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);
sphere.castShadow = true;
hologram.add(sphere);

const innerSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);
innerSphere.castShadow = true;
hologram.add(innerSphere);

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.88, 2.25, 16, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.03,
    wireframe: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);
cone.position.y = -1.6;
cone.rotation.x = Math.PI;
cone.receiveShadow = true;
hologram.add(cone);

scene.add(hologram);

// --> HOLOGRAM LIGHT BOX

const lightBox = new THREE.Group();

const lightBoxBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.2, 0.2, 36, 36),
  new THREE.MeshStandardMaterial({ color: 0x000000 })
);
lightBoxBody.position.y = -2.4;
lightBoxBody.doubleSided = true;
lightBoxBody.castShadow = true;
lightBox.add(lightBoxBody);

const lightBoxRim = new THREE.Mesh(
  new THREE.TorusGeometry(0.2, 0.03, 36, 36),
  new THREE.MeshStandardMaterial({ color: 0x000000 })
);
lightBoxRim.position.y = -2.3;
lightBoxRim.rotation.x = Math.PI / -2;
lightBoxRim.castShadow = true;
lightBox.add(lightBoxRim);

const lightBoxCover = new THREE.Mesh(
  new THREE.CircleGeometry(0.2, 36),
  new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    metalness: 0.1,
    roughness: 0.1,
  })
);
lightBoxCover.position.y = -2.29;
lightBoxCover.rotation.x = Math.PI / -2;
lightBox.add(lightBoxCover);

scene.add(lightBox);

// --> ATMOSPHERE

const fog = new THREE.Fog(0x111111, 0.1, 20);
scene.fog = fog;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color: 0x111117 })
);
floor.position.y = -2.5;
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
camera.position.z = 6;
camera.position.y = -1;
camera.lookAt(cone.position);
scene.add(camera);

// --> CONTROLS

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --> GUI

const gui = new GUI();
const params = {
  hologramColour: 0x00ffff,
  atmosphereColour: 0x111111,
  enableRotation: true,
  rotationSpeed: 0.2,
  enableFlickering: true,
};
gui.onChange(() => {
  const newHologramColour = new THREE.Color(params.hologramColour);
  sphere.material.color = newHologramColour;
  innerSphere.material.color = newHologramColour;
  cone.material.color = newHologramColour;
  lightBoxCover.material.color = newHologramColour;

  const newAtmosphereColour = new THREE.Color(params.atmosphereColour);
  fog.color = newAtmosphereColour;
  renderer.setClearColor(newAtmosphereColour);
});
gui
  .add(sphere.material, 'size')
  .name('Hologram Particle Size')
  .min(0.001)
  .max(0.1)
  .step(0.001);
gui.addColor(params, 'hologramColour').name('Hologram Colour');
gui.addColor(floor.material, 'color').name('Platform Colour');
gui.addColor(params, 'atmosphereColour').name('World Colour');
gui.add(params, 'enableRotation').name('Hologram Rotation');
gui
  .add(params, 'rotationSpeed')
  .name('Hologram Rotation Speed')
  .min(0)
  .max(1)
  .step(0.01);
gui.add(params, 'enableFlickering').name('Hologram Flicker');
gui
  .add(pointLight, 'intensity')
  .name('Point Light Intensity')
  .min(0)
  .max(20)
  .step(0.1);

// --> RENDERER

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setClearColor(0x111111);
renderer.render(scene, camera);

// --> TICKER

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // -> Rotate Animation
  if (params.enableRotation) {
    sphere.rotation.y = elapsedTime * params.rotationSpeed;
    cone.rotation.y = -elapsedTime * params.rotationSpeed;
  }
  // -> Flicker animation
  if (params.enableFlickering) {
    if (Math.random() < 0.5 && elapsedTime.toFixed(2) % 0.75 === 0) {
      sphere.visible = false;
      innerSphere.visible = false;
      cone.visible = false;
    } else {
      sphere.visible = true;
      innerSphere.visible = true;
      cone.visible = true;
    }
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
