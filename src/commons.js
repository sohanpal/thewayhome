import 'phaser';

export default {
  preload(context) {
    context.load.image('sky','assets/sky.png');
    context.load.image('ground', 'assets/platform.png');
    context.load.image('star', 'assets/star.png');
    context.load.image('bomb', 'assets/bomb.png');
    context.load.image('full_ground','assets/tilesets/nature/_ground/ground05.png');
    context.load.image('leafy01','assets/tilesets/nature/_leafy_ground/leafy_ground01.png');
    context.load.image('leafy03','assets/tilesets/nature/_leafy_ground/leafy_ground03.png');
    context.load.image('ground01','assets/tilesets/nature/_ground/ground01.png');

    context.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    context.load.audioSprite('sfx', 'assets/audio/SoundEffects/fx_mixdown.json', [
        'assets/audio/SoundEffects/fx_mixdown.ogg',
        'assets/audio/SoundEffects/fx_mixdown.mp3'
    ]);
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
  },

  updateHandlerPlayerMovement(context) {
    if (context.cursors.left.isDown)
    {
      context.player.setVelocityX(-200);
      context.player.anims.play('left', true);
    }
    else if (context.cursors.right.isDown)
    {
      context.player.setVelocityX(200);
      context.player.anims.play('right', true);
    }
    else
    {
      context.player.setVelocityX(0);
      context.player.anims.play('turn');
    }

    if (context.cursors.up.isDown && context.player.body.touching.down)
    {
      context.player.setVelocityY(-450);
    }
  },

  getBasicSceneTileSet() {
    let tiles = [];
    for (let x = 1; x <= 25; x++) {
      tiles[x] = [];
      // write ground-level blocks
      tiles[x][13] = 'leafy01';
    }

    return tiles;
  },

  renderTileSet(tiles, context) {
    for (let x = 1; x <= tiles.length; x++) {
      if (tiles[x] === undefined) { continue; }
      if (tiles[x].length === 0) { continue; }

      for (let y = 1; y <= tiles[y].length; y++) {
        if (tiles[x][y] === undefined) { continue; }
        let tileX = x * 64 - 32;
        let tileY = y * 64 - 32 - 12;
        let tileType = tiles[x][y];
        context.fullGroundBlock = context.platforms.create(tileX, tileY, tileType).setScale(.5).refreshBody();
      }
    }

    // @todo remove
    this.renderCoordsHelper(tiles, context);
  },

  renderCoordsHelper(tiles, context) {
    const coordStyle = {
      fill: '#000000',
      fontSize: '10px',
      align: 'left'
    };
    const coordStyle2 = {
      fill: '#FFFFFF',
      fontSize: '10px',
      align: 'left'
    };

    for (let x = 1; x <= tiles.length; x++) {
      for (let y = 1; y <= tiles[y].length; y++) {
        let tileX = x * 64 - 32;
        let tileY = y * 64 - 32 - 12;
        context.add.text(tileX-20, tileY, x + ' x ' + y, coordStyle);
        context.add.text(tileX-21, tileY-1, x + ' x ' + y, coordStyle2);
      }
    }
  },

  /**
   * Draw collectible items at the given coordinates.
   *
   * Expects a handler context.touchCollectible to exist, which is called
   * in collision of player and item.
   */
  prepareCollectibles(coordinates, context) {
    context.collectibles = context.physics.add.group({
      key: 'star',
      frameQuantity: coordinates.length
    });

    context.collectibles.getChildren().forEach((item, index) => {
      if (coordinates[index] === undefined) {
        item.destroy();
      } else {
        item.x = coordinates[index][0] * 64 - 32;
        item.y = coordinates[index][1] * 64 - 32 - 12;
      }

      item.origIndex = index;
    });

    context.physics.add.collider(context.collectibles, context.platforms);

    context.physics.add.overlap(
      context.player,
      context.collectibles,
      context.touchCollectible,
      null,
      context
    );
  }
}
