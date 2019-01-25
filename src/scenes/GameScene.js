import 'phaser';
import commons from '../commons.js';

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }

  init() {
  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
  }

  /**
   * Create game start.
   */
  create () {
    commons.createPlatform(this);

    this.add.image(400, 300, 'sky');

    // this.platforms added by commons.createPlatform()
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    commons.createPlayer(this);
    this.score = 0;

    this.stars = this.physics.add.group({
        key: 'star',
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
    this.sound.playAudioSprite('sfx', 'numkey');
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    if (this.score == 120) {
      this.sound.playAudioSprite('sfx', 'escape');
      this.scene.start('Game2');
    }
  }
};
