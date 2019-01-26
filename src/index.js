import 'phaser';
import config from './config/config';
import GameScene from './scenes/GameScene';
import SceneGermany from './scenes/SceneGermany';
import SceneIndia from './scenes/SceneIndia';
import SceneTurkmenistan from './scenes/SceneTurkmenistan';
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
    this.scene.add('Germany', SceneGermany);
    this.scene.add('India', SceneIndia);
    this.scene.add('Turkmenistan', SceneTurkmenistan);

    this.scene.start('Turkmenistan');
  }
}

window.game = new Game();
