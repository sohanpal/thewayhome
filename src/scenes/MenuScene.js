import 'phaser';
import config from '../config/config.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  preload() {
  }

  /**
   * Create main menu.
   */
  create() {
    // GGJ logo
    const logo = this.add.image(config.width/2, config.height/2, 'ggj-logo');
    logo.setScale(.25);
    const menuStyle = {
      fill: '#02c6c9',
      fontSize: '32px'
    };

    const btnStartGame = this.add.text(config.width/2 - 90, config.height/4, 'Start Game', menuStyle);
    btnStartGame.setInteractive();
    btnStartGame.on('pointerdown', () => {
      this.scene.start('Game');
    }, this);

    // Will be read in the GameScene
    // Starting point for creating an Options menu.
    this.registry.set('GameDuration', 200);
  }

};
