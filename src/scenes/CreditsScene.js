import 'phaser';
import config from '../config/config.js';

export default class CreditsScene extends Phaser.Scene {
  constructor () {
    super('Credits');
  }
 
  preload () {
    this.load.image('logo', 'assets/Logo_without_background.png');
  }

  /**
   * Dumps the credits.
   */
  create () {
    // "The way back home" logo
    const logo = this.add.image(1350, 200, 'logo');
    logo.setScale(.50);

    const scoreTextStyle = {
      fill: '#a2e363',
      fontSize: '40px',
      align: 'center'
    };
    const creditTextStyle = {
      fill: '#02c6c9',
      fontSize: '33px',
      align: 'center'
    };
    const attributionStyle = {
      fill: '#02c6c9',
      fontSize: '20px',
      align: 'center'
    };

    this.add.text(640, config.height/4, 'Your score:', scoreTextStyle);
    this.add.text(920, config.height/4, this.registry.get('score'), scoreTextStyle);
    let creditText = 'Thank you for playing.\n' +
      '\nThis game was made by Tino Dietel,\nRustam Miyliyev, Jasbir Singh\n' +
      ' and Stanislau Saprankou.\n' +
      '\nClick on text to return to Mainmenu and start the game again.\n';
    const btnStartGame = this.add.text(200, config.height/2, creditText, creditTextStyle);
    let attributionText = '\nImages taken from www.freepik.com/free-vector/' +
      '\nand www.freepik.com/free-vector/';
    this.add.text(500, 700, attributionText, attributionStyle);

    btnStartGame.setInteractive();
    btnStartGame.on('pointerdown', () => {
      this.scene.start('Menu');
    }, this);
  }
};
