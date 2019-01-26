import 'phaser';
import config from './config/config';
import GameScene from './scenes/GameScene';
import SceneGermany from './scenes/SceneGermany';
import SceneIndia from './scenes/SceneIndia';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import CreditsScene from './scenes/CreditsScene';

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Menu', MenuScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Germany', SceneGermany);
    this.scene.add('India', SceneIndia);
    this.scene.start('Germany');

    this.registry.set('score', 0);
  }
}

window.game = new Game();
