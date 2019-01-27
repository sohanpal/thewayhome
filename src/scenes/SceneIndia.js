import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class GameScene2 extends Phaser.Scene {

  constructor () {
    super('India');
    this.nextScene = 'Turkmenistan';
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
    this.load.image('background','assets/backgrounds/taj1.jpg');
    this.load.image('tree01','assets/tilesets/nature/flowers_plants/tree01.png');
    this.load.image('mushroom','assets/tilesets/nature/flowers_plants/mushroom03.png');
    this.load.image('spikes','assets/tilesets/nature/flowers_plants/spikes_black.png');
    this.load.image('flowers','assets/tilesets/nature/flowers_plants/flowers copy.png');
    this.load.image('sky01','assets/tilesets/nature/sky/sky01.png');
    this.load.image('sky02','assets/tilesets/nature/sky/sky02.png');
    this.load.image('leafy04','assets/tilesets/nature/_leafy_hollow/leafy_hollow04.png');
    this.load.image('hollow03','assets/tilesets/nature/_hollow/hollow03.png');
    this.load.image('hollow15','assets/tilesets/nature/_hollow/hollow15.png');
    this.load.image('hollow_ground','assets/tilesets/nature/_hollow/hollow middle blank.png');
    this.load.image('stone05','assets/tilesets/nature/_rocks/stone05.png');
    this.load.image('water','assets/tilesets/nature/_water/water1.png');
    this.load.image('start_sign','assets/tilesets/nature/signs/board03.png');
    this.load.image('end_sign','assets/tilesets/nature/signs/board09.png');
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
    this.scoreText = this.add.text(16, 16, 'Indian Rupees : ' + commons.convertToCurrency(this.score, 'India'), { fontSize: '32px', fill: '#ffc73b' });
    
   this.collectibleCoordinates = [
      [1, 4], [2, 4], [3, 3], [9, 6], [8, 12], [12, 2], [8, 12], [9, 12],
      [10, 12], [23, 8], [21, 8], [25, 8], [22, 6], [24, 6], [1,9], [4, 3], 
      [5, 4],[6, 5], [20, 4],[23, 4], [6, 10], [10, 10], [13, 10], [14,8]
    ];

    this.itemsTouched = 0;
    // Create water tileset
    this.water = this.physics.add.staticGroup();
    for (let x = 17; x <= 18; x++) {
      let tileX = x * 64 - 32;
      let tileY = 13 * 64 - 32 - 12;
      this.fullwaterBlock = this.water.create(tileX, tileY, 'water').setScale(.5).refreshBody();
      this.physics.add.overlap(
        this.player,
        this.fullwaterBlock,
        this.touchObstruction,
        null,
        this
      );
    };

    this.spike = this.physics.add.staticGroup();
    
    this.spikeBlock = this.spike.create(12 * 64 - 32, 9 * 64 - 80, 'spikes').setScale(.5).refreshBody();
      this.physics.add.overlap(
        this.player,
        this.spikeBlock,
        this.touchObstruction,
        null,
        this
    );

    commons.prepareCollectibles(this.collectibleCoordinates, this);
  }

  // event handler for player touching water
  touchObstruction ()
  {
    this.score -= 1;
    this.scoreText.setText('Indian Rupees: ' + commons.convertToCurrency(this.score, 'India'));
    this.sound.playAudioSprite('sfx', 'meow');
    this.player.body.reset(100, 700);
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
      this.sound.playAudioSprite('sfx', 'escape');
      this.registry.set('score', this.score);
      this.scene.start(this.nextScene);
  }

  prepareTileSet ()
  {
    let tiles = commons.getBasicSceneTileSet('hollow03');
    //Remove default tiles with grass
    for (let x = 17; x <= 18; x++) {
      delete tiles[x][13];
    }

    tiles[25][10] = 'tree01';
    tiles[24][11] = 'tree01';
    tiles[25][12] = 'hollow_ground';
    tiles[25][13] = 'hollow_ground';
    tiles[3][13] = 'hollow_ground';
    tiles[24][13] = 'hollow_ground';
    tiles[3][5] = 'hollow_ground';
    tiles[4][5] = 'hollow_ground';
    tiles[3][12] = 'hollow03';
    tiles[25][11] = 'hollow03';
    tiles[24][12] = 'hollow03';
    tiles[1][10] = 'hollow03';
    tiles[13][8] = 'mushroom';
    tiles[16][7] = 'stone05';
    tiles[9][7] = 'leafy04';
    tiles[12][5] = 'leafy04';
    tiles[5][5] = 'leafy04';
    tiles[2][5] = 'leafy04';
    tiles[3][4] = 'leafy04';
    tiles[4][4] = 'leafy04';
    tiles[1][5] = 'flowers';
    tiles[1][12] = 'start_sign';
    for (let x = 4; x <= 13; x++) {
        tiles[x][11] = 'hollow03';
    }

    for (let x = 11; x <= 15; x++) {
        tiles[x][9] = 'hollow03';
    }

    for (let x = 18; x <= 24; x++) {
        tiles[x][5] = 'hollow03';
    }

    for (let x = 20; x <= 25; x++) {
        tiles[x][7] = 'hollow03';
    }

    for (let x = 19; x <= 25; x++) {
        tiles[x][9] = 'hollow03';
    }

    for (let y = 6; y <= 9; y++) {
        tiles[18][y] = 'hollow_ground';
    }

    for (let y = 12; y <= 13; y++) {
      for (let x = 4; x <= 7; x++) {
        tiles[x][y] = 'hollow_ground';
      }
    }
    
    for (let y = 6; y <= 6; y++) {
      for (let x = 1; x <= 6; x++) {
        tiles[x][y] = 'hollow_ground';
      }
    }

    for (let x = 1; x <= 25; x = x+5) {
      tiles[x][1] = 'sky01';
      
    }

    for (let x = 8; x <= 25; x = x+6) {
      tiles[x][2] = 'sky02';
    }
    
    tiles[1][6] = 'leafy04';
    tiles[6][6] = 'leafy04';
    tiles[12][9] = 'hollow15';
    return tiles;
  }

  touchCollectible (player, touchedItem) {
    this.sound.playAudioSprite('sfx', 'ping');
    touchedItem.disableBody(true, true);
    this.itemsTouched += 1;
    this.score += 1;
    this.scoreText.setText('Indian Rupee: ' + commons.convertToCurrency(this.score, 'India'));
    let prevSceneScore = this.registry.get('score');
    if (this.collectibleCoordinates.length == this.itemsTouched) {
        this.finish = this.physics.add.image(1380, 600, 'end_sign');
        this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        this.physics.add.collider(this.finish, this.platforms);
        this.physics.add.overlap(this.player, this.finish, this.finishStage, null, this);
    }
  }
};
