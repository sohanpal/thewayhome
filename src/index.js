import 'phaser';
import config from './config/config';
import GameScene from './scenes/GameScene';
import GameScene2 from './scenes/GameScene2';
import SceneIndia from './scenes/SceneIndia';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import CreditsScene from './scenes/CreditsScene';

class Game extends Phaser.Game {
  constructor () {
    super(config);
    this.registry.set('score', 0);

    this.scene.add('Boot', BootScene);
    this.scene.add('Menu', MenuScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Game2', GameScene2);
    this.scene.add('India', SceneIndia);
    this.scene.start('Boot');
  }
}

window.game = new Game();
