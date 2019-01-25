import 'phaser';

export default {
  preload(context) {
    context.load.image('sky','assets/sky.png');
    context.load.image('ground', 'assets/platform.png');
    context.load.image('star', 'assets/star.png');
    context.load.image('bomb', 'assets/bomb.png');

    context.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  },

  createPlatform(context) {
    context.platforms = context.physics.add.staticGroup();
  },

  createPlayer(context) {
    context.player = context.physics.add.sprite(100, 450, 'dude');

    context.player.setBounce(0.2);
    context.player.setCollideWorldBounds(true);

    context.anims.create({
        key: 'left',
        frames: context.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    context.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    context.anims.create({
        key: 'right',
        frames: context.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    context.cursors = context.input.keyboard.createCursorKeys();
    context.physics.add.collider(context.player, context.platforms);
  }
}
