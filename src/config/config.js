import 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: 1600,
  height: 800,
  physics: {
     default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
  },
  audio: {
      disableWebAudio: true
  }
};
