import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class GameScene2 extends Phaser.Scene {

  constructor () {
    super('India');
    this.nextScene = 'Game';
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
   
    this.load.image('background','assets/backgrounds/taj.jpg');
  }

  /**
   * Create game start.
   */
  create () {
    commons.createPlatform(this);
    const background = this.add.image(800, 400, 'background');
    background.setDisplaySize(config.width, config.height);

    commons.renderTileSet(this.prepareTileSet(), this);

    commons.createPlayer(this);
    this.score = this.registry.get('score');

    this.finish = this.physics.add.image(1380, 600, 'star');
    this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    this.scoreText = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(this.finish, this.platforms);
    this.physics.add.overlap(this.player, this.finish, this.finishStage, null, this);

    this.collectibleCoordinates = [
      
    ];
    commons.prepareCollectibles(this.collectibleCoordinates, this);
  }

  /**
   * Update left game duration each tick and end game after time ends.
   *
   * @param {float} time Total game time in microseconds.
   * @param {float} delta Delta time in microseconds.
   */
  update ()
  {
    commons.updateHandlerPlayerMovement(this);
  }

  finishStage (player, star)
  {
      //this.star.disableBody(true, true);
      this.registry.set('score', this.score);
      this.scene.start('Credits');
      //this.score += 10;
      //this.scoreText.setText('Score: ' + this.score);
  }

  prepareTileSet ()
  {
    let tiles = commons.getBasicSceneTileSet('hollow03');
    return tiles;
  }

  touchCollectible (player, touchedItem) {
    this.sound.playAudioSprite('sfx', 'numkey');
    touchedItem.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    let prevSceneScore = this.registry.get('score');

    if (this.score - prevSceneScore == this.collectibleCoordinates.length * 10) {
      this.sound.playAudioSprite('sfx', 'escape');
      this.registry.set('score', this.score);
      this.scene.start(this.nextScene);
    }
  }
};
