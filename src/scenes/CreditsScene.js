import 'phaser';
import config from '../config/config.js';

export default class CreditsScene extends Phaser.Scene {
  constructor () {
    super('Credits');
  }
 
  preload () {
  }

  /**
   * Dumps the credits.
   */
  create () {
    const menuStyle = {
      fill: '#02c6c9',
      fontSize: '50px',
      align: 'center'
    };
    this.add.text(config.width/10, config.height/4, 'Your score:', menuStyle);
    this.add.text(config.width/3 , config.height/4, this.registry.get('score'), menuStyle);
    const btnStartGame = this.add.text(config.width/2 - 500, config.height/2, 'Thank you for playing.\nClick on text to return to Mainmenu', menuStyle);
    btnStartGame.setInteractive();
    btnStartGame.on('pointerdown', () => {
      this.scene.start('Menu');
    }, this);
  }
};
