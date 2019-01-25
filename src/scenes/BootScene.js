import 'phaser';
import config from '../config/config.js';

export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }
 
  /**
   * Preload some bigger assets here.
   */
  preload () {
    this.load.image('ggj-logo', 'assets/ggj-logo.png');
  }

  create () {
    // Background image
    const logo = this.add.image(config.width/2, config.height/2, 'ggj-logo');
    logo.setScale(.5);
    this.time.delayedCall(1000, () => {this.scene.start('Menu');}, [], this);
    // this.scene.start('Menu');
  }
};
