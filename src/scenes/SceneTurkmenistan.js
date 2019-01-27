import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class SceneTurkmenistan extends Phaser.Scene {

  constructor () {
    super('Turkmenistan');
    this.nextScene = 'Belarus';
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
    this.load.image('desert_background','assets/backgrounds/1600x800_Desert_Sanjar.png');
    this.load.image('warning_board','assets/tilesets/nature/signs/board08.png');
    this.load.image('map_board','assets/tilesets/nature/signs/board09.png');
    this.load.image('lava','assets/tilesets/nature/_lava/lava 1.png');
    this.load.image('sand','assets/tilesets/nature/sand/slice05_05_128.png');
    this.load.image('sand_ground','assets/tilesets/nature/sand/slice27_27_128.png');
    this.load.image('grass','assets/tilesets/nature/_grass/grass07.png');
    this.load.image('100manat', 'assets/currencies/100manat.jpg');
  }

  /**
   * Create game start.
   */
  create () {
    commons.createPlatform(this);
    const background = this.add.image(800, 400, 'desert_background');
    background.setDisplaySize(config.width, config.height);

    commons.renderTileSet(this.prepareTileSet(), this);

    commons.createPlayer(this);
    this.score = this.registry.get('score');

    this.scoreText = this.add.text(16, 16, 'Turkmenistan manat : ' + commons.convertToCurrency(this.score, 'Turkmenistan'), { fontSize: '32px', fill: '#ffc73b' });

    // Map board, when you touch you go to the next level
    this.finish = this.physics.add.image(1300, 10, 'map_board').setScale(.7);
    this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    this.physics.add.collider(this.finish, this.platforms);
    this.physics.add.overlap(this.player, this.finish, this.finishStage, null, this);

    // Warning sign before lava
    this.w_board = this.physics.add.image(820, 600, 'warning_board').setScale(.7);
    this.w_board.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    this.physics.add.collider(this.w_board, this.platforms);

    this.collectibleCoordinates = [
      [4, 1], [6, 2],
      [3, 10], [5, 8], [7, 3],
      [4, 12], [6, 7], [8, 12], [11, 3],
      [16, 1], [16, 4], [16, 7], [16, 10],
      [19, 1], [19, 4], [19, 7], [19, 10],
      [17, 4], [18, 2],
      [23, 6]
    ];
    commons.prepareCollectibles(this.collectibleCoordinates, this, '100manat');

    // Create lava tileset
    this.lava = this.physics.add.staticGroup();
    for (let x = 14; x <= 20; x++) {
      let tileX = x * 64 - 32;
      let tileY = 13 * 64 - 32 - 12;
      this.fullLavaBlock = this.lava.create(tileX, tileY, 'lava').setScale(.5).refreshBody();
      this.physics.add.overlap(
        this.player,
        this.fullLavaBlock,
        this.touchLava,
        null,
        this
      );
    }
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

  // event handler for player touching lava
  touchLava ()
  {
    this.registry.set('score', this.score - 10);
    this.player.body.reset(100, 100);
  }

  finishStage (player, star)
  {
    this.registry.set('score', this.score);
    this.scene.start(this.nextScene);
  }

  prepareTileSet ()
  {
    let tiles = commons.getBasicSceneTileSet();
    //Remove default tiles with grass
    for (let x = 9; x <= 25; x++) {
      delete tiles[x][13];
    }

    /**
     * Put sandy tiles instead
     */
    // Ground level before lava
    for (let x = 1; x <= 13; x++) {
      tiles[x][13] = 'sand';
    }
    // Ground level after lava
    for (let x = 21; x <= 25; x++) {
      tiles[x][13] = 'sand';
    }

    let y = 10;
    for (let x = 2; x <= 6; x++) {
      tiles[x][y] = 'sand'; // Ladder
      y--;
    }

    tiles[3][11] = 'sand'; // Road with holes
    tiles[5][11] = 'sand'; // Road with holes
    tiles[7][11] = 'sand'; // Road with holes

    tiles[17][11] = 'sand'; // Above lava
    tiles[18][11] = 'sand'; // Above lava

    tiles[21][12] = 'grass';

    tiles[25][10] = 'sand'; // To reach here, jump from grass
    tiles[24][10] = 'sand'; // To reach here, jump from grass
    tiles[25][8] = 'sand'; // Hard-to-jump tile

    tiles[21][7] = 'sand'; // Blocks with a way to the next level
    tiles[22][7] = 'sand'; // Blocks with a way to the next level

    return tiles;
  }

  touchCollectible (player, touchedItem) {
    this.sound.playAudioSprite('sfx', 'ping');
    touchedItem.disableBody(true, true);
    this.score += 1;
    this.scoreText.setText('Turkmenistan manat: ' + commons.convertToCurrency(this.score, 'Turkmenistan'));

    let prevSceneScore = this.registry.get('score');

    if (this.score - prevSceneScore == this.collectibleCoordinates.length * 1) {
      this.sound.playAudioSprite('sfx', 'escape');
      this.registry.set('score', this.score);
      this.scene.start(this.nextScene);
    }
  }
};
