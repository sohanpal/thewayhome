import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class SceneGermany extends Phaser.Scene {

  constructor () {
    super('GermanySecret');
    this.nextScene = 'Germany';
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
    this.load.image('background_germany_secret','assets/backgrounds/germany_secret.jpg');

    this.load.image('shroom03','assets/tilesets/nature/flowers_plants/mushroom03.png');
    this.load.image('stone01','assets/tilesets/nature/_rocks/stone01.png');
    this.load.image('stone06','assets/tilesets/nature/_rocks/stone06.png');
  }

  /**
   * Create game start.
   */
  create () {
    commons.createPlatform(this);
    const background = this.add.image(800, 400, 'background_germany_secret');
    background.setDisplaySize(config.width, config.height);

    commons.renderTileSet(this.prepareTileSet(), this);

    commons.createPlayer(this);
    this.score = this.registry.get('score');

    this.finish = this.physics.add.image(1500, 720, 'shroom03').setScale(.5);
    this.finish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    this.scoreText = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(this.finish, this.platforms);
    this.physics.add.overlap(this.player, this.finish, this.goToSecret, null, this);

    this.collectibleCoordinates = [
      [3, 7], [5, 7], [7, 7], [9, 7], [11, 7], [13, 7],
      [15, 7], [17, 7], [19, 7], [21, 7], [23, 7],
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

  goToSecret (player, star)
  {
      this.registry.set('score', this.score);
      this.registry.set('germanySecretPassed', true);
      this.scene.start('Germany');
  }

  prepareTileSet ()
  {
    let tiles = commons.getBasicSceneTileSet();
    tiles[13][12] = 'stone06';
    return tiles;
  }

  touchCollectible (player, touchedItem) {
    this.sound.playAudioSprite('sfx', 'numkey');
    touchedItem.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }
};
