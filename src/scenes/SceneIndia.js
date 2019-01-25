import 'phaser';
import commons from '../commons.js';

export default class SceneIndia extends Phaser.Scene {
  constructor () {
    super('India');
  }

  init() {

  }

  /**
   * Preload images.
   */
  preload () {
    commons.preload(this);
    this.load.image('background','assets/backgrounds/mountains.jpg');
  }

  /**
   * Create game start.
   */
  create () {
    commons.createPlatform(this);
    const background = this.add.image(800, 400, 'background');
    background.setDisplaySize(1600, 800);

    // this.platforms added by commons.createPlatform()
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
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
      if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }

    collectStar (player, star)
    {
        //this.star.disableBody(true, true);
        this.scene.start('Credits');
        //this.score += 10;
        //this.scoreText.setText('Score: ' + this.score);
    }
};
