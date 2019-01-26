import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class SceneBelarus extends Phaser.Scene {
  constructor () {
    super('Belarus');
    this.tileWidth = 64;
    this.tileHeight = 64;
    this.collectableWidth = 24;
    this.collectableHeight = 22;
    this.score = 0;
    this.platformTiles = [];
    this.collectables = [];

    //TODO - put into config or common
    this.jumpHeight = 100;
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
    this.load.image('background_bel','assets/backgrounds/belarus.jpg');
  }

  /**
   * Create game start.
   */
  create () {
    commons.createPlatform(this);
    const background = this.add.image(800, 400, 'background_bel');
    background.setDisplaySize(config.width, config.height);

    this.prepareTileSet();
    commons.renderTileSet(this.platformTiles, this);

    commons.createPlayer(this);
    this.renderCollectables();

    this.score = 0;

    this.scoreText = this.add.text(16, 16, 'Belarus rouble: ' + this.score, { fontSize: '32px', fill: '#000' });
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
      this.scene.start('India');
  }

  prepareTileSet ()
  {
    this.platformTiles = commons.getBasicSceneTileSet('tundra');

    this.platformTiles[9][13] = 'ice_block';
    this.platformTiles[10][13] = 'ice_block';

    this.platformTiles[4][13] = 'ice_block';
    this.platformTiles[5][13] = 'ice_block';

    this.platformTiles[3][10] = 'tundra_cliff_left';
    this.platformTiles[4][10] = 'tundra';
    this.platformTiles[5][10] = 'tundra_cliff_right';

    this.platformTiles[6][11] = 'tundra_cliff_left';
    this.platformTiles[7][11] = 'tundra_cliff_right';

    this.drawTundraCliff(5, 20, 8);
    this.drawTundraCliff(9, 13, 6);
    this.drawTundraCliff(20, 24, 3);
    this.drawTundraCliff(3, 6, 2);

    this.platformTiles[5][4] = 'tundra';
  }

  drawTundraCliff(x1, x2, y) {
    this.platformTiles[x1 - 1][y] = 'tundra_cliff_left';
    for (let i = x1; i <= x2; i++) {
        this.platformTiles[i][y] = 'tundra'
    }
    this.platformTiles[x2 + 1][y] = 'tundra_cliff_right';
}

  renderCollectables() {
    for (let i = 0; i < 20; i++) {
        let y_coordinate = -1;
        let x_coordinate = -1;

        let i = 0;

        while (!this.isCollectableCoordinatesValid(x_coordinate, y_coordinate)) {
            y_coordinate = Math.floor(Math.random() * 13);
            x_coordinate = Math.floor(Math.random() * 25);
        }

        if (this.collectables[x_coordinate] == undefined) {
            this.collectables[x_coordinate] = [];
        }

        this.collectables[x_coordinate][y_coordinate] = 'star';

        let star = this.physics.add.sprite(x_coordinate * this.tileWidth, y_coordinate * this.tileHeight, 'star');
        star.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, star, function() {this.collectStar(star);}, null, this);
      }
  }

  collectStar(obj) {
        this.score += 10;
        this.scoreText.text = "Belarus rouble: " + this.score;
        obj.destroy();

        if (this.score >= 100) {
            this.scene.start('Germany');
        }
  }

  isCollectableCoordinatesValid(x, y) {
      return x >= 0 &&
      y >= 0 &&
      this.isTileReachableFromPlatform(x, y) &&
      (this.platformTiles[x] == undefined || this.platformTiles[x][y + 1] == undefined) &&
      (this.collectables[x] == undefined || this.collectables[x][y + 1] == undefined);
  }

  isTileReachableFromPlatform(x, y) {
      for (let y_axis = 0; y_axis <= y; y_axis++) {
          for (let x_axis = x - 2; x_axis < x + 2; x_axis++) {
            if (this.platformTiles[x_axis] != undefined && this.platformTiles[x_axis][y_axis] != undefined) {
                return true;
            }
          }
      }

      for (let y_axis = y - 2; y_axis <= y + 2; y_axis++) {
        for (let x_axis = x - 2; x_axis <= x + 2; x_axis++) {
          if (this.platformTiles[x_axis] != undefined && this.platformTiles[x_axis][y_axis] != undefined) {
              return true;
          }
        }
    }

    return false;
  }

};
