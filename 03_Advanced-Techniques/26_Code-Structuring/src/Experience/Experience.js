import * as THREE from 'three';

import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';

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
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();

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
    this.renderer.update();
  }
}
