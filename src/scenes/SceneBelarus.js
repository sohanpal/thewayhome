import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class SceneBelarus extends Phaser.Scene {
  constructor () {
    super('Belarus');
    this.forbiddenAreas = new Set();
    this.tileWidth = 64;
    this.tileHeight = 64;
    this.collectableWidth = 24;
    this.collectableHeight = 22;
    this.score = 0;

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

    commons.renderTileSet(this.prepareTileSet(), this);

    commons.createPlayer(this);
    this.renderCollectables();

    this.score = 0;

    this.scoreText = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });
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

    for (let x = 1; x <= 4; x++) {
      tiles[x][6] = 'leafy03';
    }

    tiles[7][4] = 'leafy03';

    for (let x = 10; x <= 15; x++) {
      tiles[x][3] = 'leafy03';
    }

    this.setForbiddenAreas(tiles);

    return tiles;
  }

  /**
   * calculates the areas of the tilemap where there are already tiles and thus no collectable may be placed
   * Ideally forbiddenAreas array should contain as few elements as possible
   * 
   * @param {array} tiles 
   */
  setForbiddenAreas(tiles) {
      let area = {x1 : -1, y1 : -1, x2 : 0, y2 : 0};
      for (let x = 1; x <= tiles.length; x++) {

        if (tiles[x] == undefined) {
            continue;
        }

          for (let y = 0; y < tiles[x].length; y++) {
              if (tiles[x][y] != undefined) {
                if (area.x1 == -1) {
                    area.x1 = (x-1) * this.tileWidth;
                }
                
                area.x2 = x * this.tileWidth;

                if (area.y1 == -1) {
                    area.y1 = (y-1) * this.tileHeight;
                }

                area.y2 = y*this.tileHeight;
            } else if(area.x1 > -1) {
                this.forbiddenAreas.add(area);
                area = {x1 : -1, y1 : -1, x2 : 0, y2 : 0};
            }
          }
      }
  }

  renderCollectables() {
    for (let i = 0; i < 20; i++) {
        let y_coordinate = 0;
        let x_coordinate = 0;

        let i = 0;

        while (!this.isCollectableCoordinatesValid(x_coordinate, y_coordinate)) {
            y_coordinate = Math.random() * 800;
            x_coordinate = Math.random() * 1600;
        }

        let star = this.physics.add.sprite(x_coordinate, y_coordinate, 'star');
        star.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, star, function() {this.collectStar(star);}, null, this);
      }
  }

  collectStar(obj) {
        this.scoreText.text = "Score: " + ++this.score;
        obj.destroy();

        if (this.score >= 3) {
            console.log("enter");
            this.scene.start('Game2');
        }
  }

  isCollectableCoordinatesValid(x, y) {
      if (x < 50) {
          return false;
      }

      let inReachFromPlatform = false;

      //@TODO - try forEach
      for (let i = 0; i < this.forbiddenAreas.length; i++) {
        var overlap = !(this.forbiddenAreas[i].x2 < x || 
            this.forbiddenAreas[i].x1 > x + this.collectableWidth || 
            this.forbiddenAreas[i].y2 < y || 
            this.forbiddenAreas[i].y1 > y + this.collectableHeight);

        if (this.forbiddenAreas[i].y2 <= y - this.jumpHeight) {
            inReachFromPlatform = true;
        }

        if (overlap) {
            return false;
        }
      }

      return true;
      //return inReachFromPlatform;
  }

  isOverlapping(x1, y1) {

  }
  
};
