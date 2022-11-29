import * as THREE from 'three';
import { getRandomRGB, getRandomXY } from '../../../Utils/Utils';

const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

for (let i = 0; i < 3; i++) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: `rgb(${getRandomRGB()})`,
    })
  );
  mesh.position.set(...getRandomXY(), 1);
  group.add(mesh);
}
const sizes = { width: 800, height: 600 };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

// GROUP Properties
group.rotation.y = 1;
group.scale.z = 2;

const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
