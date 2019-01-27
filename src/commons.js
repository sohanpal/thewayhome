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

    context.load.image('snow','assets/tilesets/nature/snow/snow.png');
    context.load.image('snow_cliff_left','assets/tilesets/nature/snow/snowCliffLeft.png');
    context.load.image('ice_block','assets/tilesets/nature/snow/iceBlock.png');
    context.load.image('snow_cliff_right','assets/tilesets/nature/snow/snowCliffRight.png');
    context.load.image('tundra','assets/tilesets/nature/snow/tundra.png');
    context.load.image('tundra_cliff_right','assets/tilesets/nature/snow/tundraCliffRightAlt.png');
    context.load.image('tundra_cliff_left','assets/tilesets/nature/snow/tundraCliffLeft.png');

    context.load.spritesheet('hero_idle',
        'assets/sprites/traveler/idle_slim.png',
        { frameWidth: 54, frameHeight: 64}
    );
    context.load.spritesheet('hero_fly_up',
        'assets/sprites/traveler/fly_up_slim.png',
        { frameWidth: 54, frameHeight: 64 }
    );
    context.load.spritesheet('hero_fly_down',
        'assets/sprites/traveler/fly_down_slim.png',
        { frameWidth: 54, frameHeight: 64 }
    );
    context.load.spritesheet('hero_run',
        'assets/sprites/traveler/run_slim.png',
        { frameWidth: 54, frameHeight: 64 }
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
    context.player = context.physics.add.sprite(100, 450, 'hero_idle');

    context.player.setBounce(0.2);
    context.player.setCollideWorldBounds(true);

    context.anims.create({
        key: 'hero_idle',
        frames: context.anims.generateFrameNumbers('hero_idle', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    context.anims.create({
        key: 'run',
        frames: context.anims.generateFrameNumbers('hero_run', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    context.anims.create({
        key: 'turn',
        frames: [ { key: 'hero_idle', frame: 4 } ],
        frameRate: 20
    });

    context.anims.create({
        key: 'hero_fly_up',
        frames: context.anims.generateFrameNumbers('hero_fly_up', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    context.anims.create({
        key: 'hero_fly_down',
        frames: context.anims.generateFrameNumbers('hero_fly_down', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    context.cursors = context.input.keyboard.createCursorKeys();
    context.physics.add.collider(context.player, context.platforms, this.handlePlayerOnGround);
  },

  handlePlayerOnGround(player, platform) {
    if (player.isFlying !== false) {
      player.anims.play('hero_idle', true);
      player.isFlying = false
      player.setVelocityY(0);
    } else if (player.body.velocity.x == 0) {
      player.anims.play('hero_idle', true);
    }
  },

  updateHandlerPlayerMovement(context) {
    if (context.cursors.up.isDown && context.player.body.touching.down)
    {
      context.player.anims.play('hero_fly_up', true);
      context.player.setVelocityY(-450);
      context.player.isFlying = 'up';
    } else if (context.player.isFlying != false) {
      if(context.player.isFlying == 'up' && context.player.body.velocity.y > 0) {
        context.player.isFlying = 'down';
        context.player.anims.play('hero_fly_down', true);
      }
    }

    if (context.cursors.left.isDown)
    {
      context.player.setVelocityX(-250);
      context.player.flipX = true;

      if(!context.player.isFlying) {
        context.player.anims.play('run', true);
      }
    }
    else if (context.cursors.right.isDown)
    {
      context.player.setVelocityX(250);
      context.player.flipX = false;

      if(!context.player.isFlying) {
        context.player.anims.play('run', true);
      }
    }
    else
    {
      context.player.setVelocityX(0);
    }
  },

  getBasicSceneTileSet(tile = 'leafy01') {
    let tiles = [];
    for (let x = 1; x <= 25; x++) {
      tiles[x] = [];
      // write ground-level blocks
      tiles[x][13] = tile;
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
    //this.renderCoordsHelper(tiles, context);
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
  prepareCollectibles(coordinates, context, icon = 'star') {
    context.collectibles = context.physics.add.group({
      key: icon,
      frameQuantity: Object.keys(coordinates).length
    });

    let countedIndex = 0;

    context.collectibles.getChildren().forEach((item, index) => {
      if (coordinates[countedIndex] === undefined) {
        //item.destroy();
      } else {
        item.x = coordinates[countedIndex][0] * 64 - 32;
        item.y = coordinates[countedIndex][1] * 64 - 32 - 12;
      }

      countedIndex++;

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
  },

 /**
  * Convert collectables to the currencies of a country defined
  * @param {int} starCount
  * @param {string} country
  */
  convertToCurrency(starCount, country) {
    switch(country) {
      case 'India' : {
        return starCount * 80;
      }
      case 'Turkmenistan' : {
        return starCount * 4;
      }
      case 'Belarus' : {
        return starCount * 2.1;
      }
      case 'Germany' : {
        return starCount;
      }
    }
  }
}
