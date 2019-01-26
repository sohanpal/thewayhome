import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class GameScene2 extends Phaser.Scene {
  constructor () {
    super('Game2');
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
    this.score = 0;

    this.finish = this.physics.add.image(1380, 600, 'star');
    this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(this.finish, this.platforms);

    this.physics.add.overlap(this.player, this.finish, this.finishStage, null, this);
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
      this.scene.start('India');
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
};
