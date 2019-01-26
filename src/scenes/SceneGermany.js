import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class SceneGermany extends Phaser.Scene {

  constructor () {
    super('Germany');
    this.nextScene = 'India';
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
    this.load.image('background','assets/backgrounds/mountains_low.jpg');
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
      [2, 5], [4, 5], [7, 3], [9, 9], [10, 2], [12, 2], [14, 2], [5, 12],
      [4, 9], [6, 7], [8, 7], [10, 7],
      [14, 5], [16, 5], [18, 5],
      [19, 8], [21, 8], [23, 8],
      [10, 12], [12, 12], [14, 12], [16, 12], [18, 12], [20, 12],
      [12, 9], [14, 9], [17, 10],
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
    let tiles = commons.getBasicSceneTileSet();

    tiles[1][13] = 'full_ground';
    tiles[1][12] = 'full_ground';
    tiles[1][11] = 'leafy01';
    tiles[2][12] = 'leafy01';
    tiles[2][13] = 'full_ground';
    tiles[3][12] = 'leafy01';
    tiles[3][13] = 'full_ground';

    for (let y = 9; y <= 13; y++) {
      for (let x = 6; x <= 8; x++) {
        tiles[x][y] = 'full_ground';
      }
    }
    tiles[8][8] = 'leafy01';
    tiles[7][8] = 'leafy01';
    tiles[6][8] = 'leafy01';
    tiles[5][9] = 'leafy01';
    tiles[5][10] = 'ground01';
    tiles[4][10] = 'leafy03';

    tiles[9][8] = 'leafy03';
    tiles[10][8] = 'leafy03';
    tiles[9][10] = 'leafy03';
    tiles[10][10] = 'leafy03';

    for (let x = 1; x <= 4; x++) {
      tiles[x][6] = 'leafy03';
    }

    tiles[7][4] = 'leafy03';

    for (let x = 10; x <= 15; x++) {
      tiles[x][3] = 'leafy03';
    }

    for (let x = 14; x <= 20; x++) {
      tiles[x][6] = 'leafy03';
    }

    for (let x = 19; x <= 25; x++) {
      tiles[x][9] = 'leafy03';
    }

    for (let x = 12; x <= 16; x++) {
      tiles[x][10] = 'leafy03';
    }

    tiles[17][11] = 'leafy03'

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