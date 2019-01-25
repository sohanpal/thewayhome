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

    // this.platforms added by commons.createPlatform()
    this.platforms.create(config.width/2, config.height+20, 'ground').setScale(4).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    commons.createPlayer(this);
    this.score = 0;

    this.stars = this.physics.add.group({
        key: 'bomb',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    this.physics.add.collider(this.stars, this.platforms);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
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

  collectStar (player, star)
  {
      //this.star.disableBody(true, true);
      this.scene.start('Credits');
      //this.score += 10;
      //this.scoreText.setText('Score: ' + this.score);
  }
};
