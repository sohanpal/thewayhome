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
  }
}
