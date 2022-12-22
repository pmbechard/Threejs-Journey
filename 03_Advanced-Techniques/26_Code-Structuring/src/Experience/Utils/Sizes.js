import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(2, window.devicePixelRatio);

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(2, window.devicePixelRatio);

      this.trigger('resize');
    });
  }
}
