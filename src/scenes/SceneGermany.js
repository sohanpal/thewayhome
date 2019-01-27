import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class SceneGermany extends Phaser.Scene {

  constructor () {
    super('Germany');
    this.nextScene = 'Credits';
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
    this.load.image('background_germany','assets/backgrounds/germany2.jpg');

    this.load.image('shroom03','assets/tilesets/nature/flowers_plants/mushroom03.png');
    this.load.image('stone01','assets/tilesets/nature/_rocks/stone01.png');
    this.load.image('stone06','assets/tilesets/nature/_rocks/stone06.png');
    this.load.image('map_board','assets/tilesets/nature/signs/board09.png');
  }

  /**
   * Create game start.
   */
  create () {
    commons.createPlatform(this);
    const background = this.add.image(800, 400, 'background_germany');
    background.setDisplaySize(config.width, config.height);

    commons.renderTileSet(this.prepareTileSet(), this);

    commons.createPlayer(this);
    this.score = this.registry.get('score');
    this.scoreText = this.add.text(16, 16, 'Euro: ' + this.score, { fontSize: '32px', fill: '#000' });

    if (!this.registry.get('germanySecretPassed')) {
      this.finish = this.physics.add.image(1500, 720, 'shroom03').setScale(.5);
      this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      this.physics.add.collider(this.finish, this.platforms);
      this.physics.add.overlap(this.player, this.finish, this.goToSecret, null, this);
    }

    this.collectibleCoordinates = [
      [2, 5], [4, 5], [7, 3], [9, 9], [10, 2], [12, 2], [14, 2], [5, 12],
      [4, 9], [6, 7], [8, 7], [10, 7],
      [14, 5], [16, 5], [18, 5],
      [19, 8], [21, 8], [23, 8],
      [10, 12], [12, 12], [14, 12], [16, 12], [18, 12], [20, 12],
      [12, 9], [14, 9], [17, 10],
    ];
    if(this.registry.get('collectedCollectibles')) {
      // secret was finished. recreate only collectibles not collected before
      this.collectedCollectibles = this.registry.get('collectedCollectibles');
    } else {
      this.collectedCollectibles = [];
    }

    let copyItems = [];

    this.collectedCollectibles.forEach((item, index) => {
      delete this.collectibleCoordinates[item];
    });
    this.collectibleCoordinates.forEach((item, index) => {
      copyItems.push(item);
    });

    this.collectibleCoordinates = copyItems;

    commons.prepareCollectibles(this.collectibleCoordinates, this, 'euro_coin');

    // Map board, when you touch you go to the next level
    this.finish = this.physics.add.image(1500, 60, 'map_board').setScale(.7);
    this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
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

  goToSecret (player, star)
  {
      this.registry.set('score', this.score);
      this.registry.set('germanySavedCollectibles', this.collectibleCoordinates);
      this.scene.start('GermanySecret');
  }

  finishStage (player, star)
  {
      this.registry.set('score', this.score);
      this.scene.start(this.nextScene);
  }

  prepareTileSet ()
  {
    let tiles = commons.getBasicSceneTileSet();

    tiles[1][13] = 'full_ground';
    tiles[1][12] = 'full_ground';
    tiles[1][11] = 'leafy01';
    tiles[2][12] = 'leafy01';
    tiles[2][13] = 'full_ground';

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

    for (let x = 22; x <= 25; x++) {
      tiles[x][3] = 'leafy03';
    }

    for (let x = 12; x <= 16; x++) {
      tiles[x][10] = 'leafy03';
    }

    tiles[17][11] = 'leafy03';

    tiles[7][7] = 'stone01';
    tiles[20][5] = 'stone01';
    tiles[13][12] = 'stone06';
    tiles[1][5] = 'stone06';

    return tiles;
  }

  touchCollectible (player, touchedItem) {
    this.sound.playAudioSprite('sfx', 'ping');
    touchedItem.disableBody(true, true);
    this.score += 1;
    this.scoreText.setText('Euro: ' + this.score);
    this.collectedCollectibles.push(touchedItem.origIndex);
    this.registry.set('collectedCollectibles', this.collectedCollectibles);
  }
};
