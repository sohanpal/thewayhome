import 'phaser';
import config from '../config/config.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  preload() {
    this.load.image('logo', 'assets/Logo_without_background.png');
  }

  /**
   * Create main menu.
   */
  create() {
    // "The way back home" logo
    const logo = this.add.image(config.width/2, config.height/2, 'logo');
    logo.setScale(.75);
    const menuStyle = {
      fill: '#02c6c9',
      fontSize: '32px'
    };

    const btnStartGame = this.add.text(config.width/2 - 95, 60, 'Start Game', menuStyle);
    btnStartGame.setInteractive();
    btnStartGame.on('pointerdown', () => {
      this.scene.start('Belarus');
    }, this);

    // Will be read in the GameScene
    // Starting point for creating an Options menu.
    this.registry.set('GameDuration', 200);
  }

};
