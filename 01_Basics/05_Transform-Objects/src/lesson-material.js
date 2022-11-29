import './style.css';
import * as THREE from 'three';
import { Vector3 } from 'three';

// INIT SCENE WITH CUBE
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
const sizes = { width: 800, height: 600 };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/*
TRANSFORMATION PROPERTIES:
position
scale
rotation
quaternion

These are held by all classes that inherit from the 3DObject class (ie Mesh, PerspectiveCamera, etc)
They are compiled in Matrices (don't need to understand that for now)
*/

// POSITION
mesh.position.x = 0.7; // left-right
mesh.position.y = -0.6; // up-down
mesh.position.z = 1; // back-forward
camera.position.x = 1;
camera.position.y = 1;

// position is a Vector3, which means it includes the following properties:
console.log(mesh.position.length()); // distance from origin
console.log(mesh.position.distanceTo(camera.position)); // distance from camera (or another object)
mesh.position.normalize(); // reduces length to 1
console.log(mesh.position.length()); // distance from origin
mesh.position.set(2, 0.5, 0.9); // set all axes at once

// Axes Helper Class:
const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// SCALE
// also a Vector3
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;
mesh.scale.set(2, 0.5, 0.5);

// ROTATION
// too much rotating can cause a gimbal lock to occur (inability to rotate further)
// rotation causes the axes to move along with the object
// you can reorder the axes to solve this - ie specifying the order that rotation should occur
mesh.rotation.reorder('YXZ');
// 180 deg = PI
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

// QUATERNION
// resolves a lot of problems that Euler objects (ie mesh.rotation) causes
// but it is much more complicated
// rotation updates quaternion and vice versa

// LOOK AT
// Object3D instances have a look at function that allows them to 'lock on' to a Vector3
camera.lookAt(new Vector3(0, 0, 0)); // central view of origin
camera.lookAt(mesh.position); // straight on view of cube

// GROUP
// You can group many objects together into a Group object which inherits from the Object3D class
// this means the position, rotation, and scale can all be accessed for the group as a whole

// RENDER
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
