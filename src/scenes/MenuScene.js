import 'phaser';
import config from '../config/config.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');

    this.storyText = 'A German pilot survives after his plane crashes somewhere over the northern India.\nNow he needs to go through multiple countries in Europe and Asia to come back home to his family and friends.\nDuring his way he will certainly need some money. Each country has its own currency.\nWhen the player reaches a new country, the money he owns are converted into the currency of the new land\n, so he can buy food and services; also, in some places plane tickets can be quite expensive.\nTry to pass all the dangers on the way and reach your home.! Do not let anything stand in your way!';
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
      fontSize: '15px'
    };

    const btnStyle = {
      fill: '#02c6c9',
      fontSize: '32px'
    };

    const btnStartGame = this.add.text(config.width/2 - 95, 60, 'Start Game', btnStyle);
    btnStartGame.setInteractive();
    btnStartGame.on('pointerdown', () => {
      this.scene.start('India');
    }, this);

    this.add.text(20, 700, this.storyText, menuStyle);

    // Will be read in the GameScene
    // Starting point for creating an Options menu.
    this.registry.set('GameDuration', 200);
  }

};
