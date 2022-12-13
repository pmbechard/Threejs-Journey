import './style.css';
import * as THREE from 'three';
import GUI from 'lil-gui';
import gsap from 'gsap';

const gui = new GUI();
const params = {
  materialColour: '#ffeded',
};
gui.addColor(params, 'materialColour').onChange(() => {
  material.color.set(params.materialColour);
  particlesMaterial.color.set(params.materialColour);
});

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// -> Meshes
const objectsDistance = 4;
const material = new THREE.MeshToonMaterial({
  color: params.materialColour,
  gradientMap: gradientTexture,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
scene.add(mesh1, mesh2, mesh3);

mesh1.position.y = -objectsDistance * 0;
mesh1.position.x = 2;
mesh2.position.y = -objectsDistance * 1;
mesh2.position.x = -2;
mesh3.position.y = -objectsDistance * 2;
mesh3.position.x = 2;

const sectionMeshes = [mesh1, mesh2, mesh3];

// -> Particles
const particlesCount = 200;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  let i3 = i * 3;
  positions[i3 + 0] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);
const particlesMaterial = new THREE.PointsMaterial({
  color: params.materialColour,
  sizeAttenuation: true,
  size: 0.03,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// -> Lights
const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const size = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000
);
camera.position.z = 3;

const parallaxGroup = new THREE.Group();
parallaxGroup.add(camera);
scene.add(parallaxGroup);

// -> Add alpha to arguments for transparent canvas
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.render(scene, camera);

let scrollY = window.scrollY;
let currentSection = 0;

let cursor = { x: 0, y: 0 };

const clock = new THREE.Clock();
let prevTime = 0;

const tick = () => {
  // -> Mesh Rotations
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // -> Camera w/ Scroll
  camera.position.y = (-scrollY / size.height) * objectsDistance;

  // -> Parallax
  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  parallaxGroup.position.x +=
    (parallaxX - parallaxGroup.position.x) * 5 * deltaTime;
  parallaxGroup.position.y +=
    (parallaxY - parallaxGroup.position.y) * 5 * deltaTime;

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
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'h') gui._hidden ? gui.show() : gui.hide();
});
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / size.height);
  if (newSection !== currentSection) {
    gsap.to(sectionMeshes[newSection].rotation, {
      duration: 3,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5',
    });
    currentSection = newSection;
  }
});
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / size.width - 0.5;
  cursor.y = e.clientY / size.height - 0.5;
});
