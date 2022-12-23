import * as THREE from 'three';

import Debug from './Utils/Debug';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';

import sources from './sources';

let instance = null;

export default class Experience {
  constructor(canvas) {
    // INIT FOR SINGLETON
    if (instance) return instance;
    else instance = this;

    // OPTIONAL GLOBAL ACCESS
    window.experience = this;

    // PROPERTIES
    this.canvas = canvas;

    // SETUP
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // RESIZE EVENT LISTENER
    this.sizes.on('resize', () => {
      this.resize();
    });

    // TICK EVENT LISTENER
    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) this.debug.ui.destroy();
  }
}
