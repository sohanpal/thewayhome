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
    this.load.image('logoBackground', 'assets/LogoAndBackground.png');
  }

  create () {
    // Background image with logo
    const logo = this.add.image(config.width/2, config.height/2, 'logoBackground');
    this.time.delayedCall(3000, () => {this.scene.start('Menu');}, [], this);
  }
};
