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

    this.load.image('shroom03','assets/tilesets/nature/flowers_plants/mushroom03.png');
    this.load.image('stone01','assets/tilesets/nature/_rocks/stone01.png');
    this.load.image('stone06','assets/tilesets/nature/_rocks/stone06.png');
    this.load.image('warning_board','assets/tilesets/nature/signs/board08.png');
    this.load.image('lava','assets/tilesets/nature/_lava/lava 1.png');
    this.load.image('sand','assets/tilesets/nature/sand/slice05_05_128.png');
    this.load.image('sand_ground','assets/tilesets/nature/sand/slice27_27_128.png');
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

    this.scoreText = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });

    // Mushroom, when you touch it the game ends
    this.finish = this.physics.add.image(1380, 600, 'shroom03').setScale(.5);
    this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    this.physics.add.collider(this.finish, this.platforms);
    this.physics.add.overlap(this.player, this.finish, this.finishStage, null, this);

    // Warning sign before lava
    this.w_board = this.physics.add.image(820, 600, 'warning_board').setScale(.7);
    this.w_board.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    this.physics.add.collider(this.w_board, this.platforms);

    this.collectibleCoordinates = [
      [2, 5], [4, 5], [7, 3], [9, 9], [10, 2], [12, 2], [14, 2], [5, 12],
      [4, 9], [6, 7], [8, 7], [10, 7],
      [14, 5], [16, 5], [18, 5],
      [19, 8], [21, 8], [23, 8],
      [10, 12], [12, 12], [14, 12], [16, 12], [18, 12], [20, 12],
      [12, 9], [14, 9], [17, 10],
    ];
    commons.prepareCollectibles(this.collectibleCoordinates, this);

    // Create lava tileset
    this.lava = this.physics.add.staticGroup();
    for (let x = 14; x <= 20; x++) {
      let tileX = x * 64 - 32;
      let tileY = 13 * 64 - 32 - 12;
      this.fullLavaBlock = this.lava.create(tileX, tileY, 'lava').setScale(.5).refreshBody();
    }
    this.physics.add.overlap(
      this.player,
      this.fullLavaBlock,
      this.touchLava,
      null,
      this
    );
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
  touchLava (player, touchedItem)
  {
    this.registry.set('score', this.score - 10);
    this.scene.restart();
    //console.log('Lava!');
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
    //Remove default tiles with grass
    for (let x = 9; x <= 25; x++) {
      delete tiles[x][13];
    }

    //Put sandy tiles instead
    for (let x = 1; x <= 13; x++) {
      tiles[x][13] = 'sand';
    }
    for (let x = 21; x <= 25; x++) {
      tiles[x][13] = 'sand';
    }

    // for (let y = 10; y <= 13; y++) {
    //   for (let x = 6; x <= 8; x++) {
    //     tiles[x][y] = 'sand_ground';
    //   }
    // }
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
