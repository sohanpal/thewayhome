import 'phaser';
import commons from '../commons.js';
import config from '../config/config.js';

export default class SceneBelarus extends Phaser.Scene {
  constructor () {
    super('Belarus');
    
    this.gameEnded = false;

    this.tileWidth = 64;
    this.tileHeight = 64;
    this.collectableWidth = 24;
    this.collectableHeight = 22;
    this.score = 0;
    this.scoreText = {};
    this.platformTiles = [];
    this.numberOfCollectables = 10;
    this.collectables = [];
    this.fatCop = {};
    this.airportWarningText = {};

    this.bynEurConvertationRate = 2.5;

    this.fatCopAngrySpeech = [
        'You are not supposed to make photos\nof this public toilet!\nPay the fee!',
        'If I see you again, we will have a talk somewhere else.',
        'You are supposed to\ncarry your birth certificate\nwith you! Pay the fee.',
        'Groups of more than 1 people\nr not allowed in the public area!\nWe are two now, pay the fee.',
        'I am not in the mood. Pay the fee.',
        'Do you have a job? I do\nnot care you re not from here.\nPay the fee!'
    ];

    this.fatCopSpeech = [
        'I wonder if my mom\nhas cooked the borscht\nalready',
        'Those drunkies are\nbeating each other\nagain. I d better\nstay out of that...',
        'Where is my rubber\nstick? Ow, it s here under\nmy belly....',
        'Vyyyychodiiiila na bereg\nKatyuuuushaaaa...',
        'Look at those freaks\n- I bet they ve never\nserved in the army, ha!'
    ];

    this.fatCopFinalSpeech = 'Got no money to pay the fee?\nLet s proceed with the deportation...\n';

    this.fatCopSpeechIndex = 0;
    this.fatCopAngrySpeechIndex = 0;

    this.fatCopSpeechElement = {};

    this.fatCopLastSpeechTime = new Date().getTime();
    this.fatCopLastJusticeTime = 0;

    this.fatCopSpeechTextStyle = {
        fontSize: '12px',
        fill: '#000',
        backgroundColor: '#FFF',
        shadowStroke: true
    };

    this.lukaSpeechTimestamp = 0;

    this.collectables = ['bel_currency_5', 'bel_currency_10', 'bel_currency_20'];
  }

  init(){}

  preload () {
    commons.preload(this);

    this.load.image('background_bel','assets/backgrounds/belarus.jpg');

    this.load.image('fat_cop','assets/sprites/fat_cop.png');
    this.load.image('tv','assets/sprites/tv.png');

    this.load.image('bel_currency','assets/currencies/bel_currency.jpg');
    this.load.image('bel_currency_5','assets/currencies/bel_currency_5.jpg');
    this.load.image('bel_currency_10','assets/currencies/bel_currency_10.jpg');
    this.load.image('bel_currency_20','assets/currencies/bel_currency_20.jpg');
    
    this.load.image('minsk_airport','assets/sprites/minsk_airport_sm.png');
    this.load.image('boduny','assets/sprites/boduny.png');
    this.load.image('map_board','assets/tilesets/nature/signs/board09.png');

    this.load.audio('fu', 'assets/audio/SoundEffects/fu_easy.mp3');
    this.load.audio('luka', 'assets/audio/SoundEffects/luka.mp3');
  }

  create () {
    commons.createPlatform(this);

    const background = this.add.image(800, 400, 'background_bel');
    background.setDisplaySize(config.width, config.height);

    this.prepareTileSet();
    commons.renderTileSet(this.platformTiles, this);

    commons.createPlayer(this);
    this.renderCollectables();

    this.fatCop = this.physics.add.sprite(350,405, 'fat_cop');
    this.fatCop.body.setAllowGravity(false);
    this.fatCop.body.moves = true;
    this.fatCop.body.setVelocityX(100);
    this.physics.add.overlap(this.player, this.fatCop, this.justice, null, this);

    this.add.image(40, 27, 'bel_currency');
    this.add.image(1000, 218, 'boduny');
    this.w_board = this.add.image(1220, 70, 'map_board').setScale(.7);

    let airport = this.physics.add.image(1410, 87, 'minsk_airport');
    airport.body.setAllowGravity(false);
    this.physics.add.overlap(this.player, airport, this.processAirportCollision, null, this);

    let luka = this.physics.add.image(100, 90, 'tv');
    luka.body.setAllowGravity(false)
    this.physics.add.overlap(this.player, luka, this.doPresidentSpeech, null, this);

    this.updateScore();
  }

  updateScore() {
    if (this.scoreText.x == undefined) {
        this.score = this.registry.get('score') == undefined ? 0 : this.registry.get('score') * this.bynEurConvertationRate; 
        this.scoreText = this.add.text(76, 16, 'Belarussian rouble: ' + this.score, { fontSize: '24px', fill: '#000'});
    } else {
        this.scoreText.text = 'Belarussian rouble: ' + this.score;
    }
  }

  doPresidentSpeech() {
    let ts = (new Date).getTime();
    
    if (ts > this.lukaSpeechTimestamp + 8000) {
        this.sound.play('luka');
        this.lukaSpeechTimestamp = ts;
    } 
  }

  processAirportCollision() {
      if (this.score >= 50) {
        this.score -= 50;
        this.registry.set('score', this.score / this.bynEurConvertationRate);
        this.scene.start('Germany');
      } else {
        this.airportWarningText = this.add.text(1410, 50, 'get 50 roubles to\nfly further!', { fontSize: '16px', fill: '#000'});
      }
  }

  checkFatCopSpeaking() {
    let ts = (new Date()).getTime();
    if (ts < this.fatCopLastSpeechTime + 8000) {
          return;
      }

      let text = this.fatCopSpeech[this.fatCopSpeechIndex]; 
      this.fatCopSpeechIndex = this.fatCopSpeechIndex == this.fatCopSpeech.length - 1 ? 0 : this.fatCopSpeechIndex + 1
      this.fatCopLastSpeechTime = ts;
      this.doFatCopSpeaking(text);
  }

  doFatCopSpeaking(text) {
      if (this.fatCopSpeechElement.x == undefined) {
          this.fatCopSpeechElement = this.add.text(this.fatCop.body.x - 10, this.fatCop.body.y - 20, text, this.fatCopSpeechTextStyle);
      } else {
          this.fatCopSpeechElement.text = text;
      }
  }

  justice() {
    let ts = (new Date()).getTime();

    if (ts < this.fatCopLastJusticeTime + 5000) {
        return;
    }

    this.sound.play('fu');

    if (this.score < 50) {
        this.doFatCopSpeaking(this.fatCopFinalSpeech);
        this.fatCopLastSpeechTime = ts;
        this.registry.set('end_game_text', 'GONNA BE DEPORTED FROM BELARUS!!\nHAHAHA!!! LOOSER!');
        this.gameEnded = true;
        this.player.body.setVelocityX(0);
        this.time.delayedCall(5000, () => {this.scene.start('Credits');}, [], this);
        this.score = 0;
      } else {
        this.score -= 50;
        this.fatCopLastJusticeTime = ts;
      
        let text = this.fatCopAngrySpeech[this.fatCopAngrySpeechIndex++];
        this.doFatCopSpeaking(text);
        this.fatCopLastSpeechTime = ts;
      }

    this.updateScore();
  }

  /**
   * Update left game duration each tick and end game after time ends.
   *
   * @param {float} time Total game time in microseconds.
   * @param {float} delta Delta time in microseconds.
   */
  update (time, delta)
  {
      if (this.gameEnded == true) {
        this.fatCop.body.setVelocityX(0);
        this.player.body.setVelocityX(0);
        return;
      }

      commons.updateHandlerPlayerMovement(this);
      this.checkFatCopSpeaking();
      
      if (this.fatCopSpeechElement.x != undefined) {
          if (this.fatCop.body.velocity.x < 0) {
              this.fatCopSpeechElement.x = this.fatCop.body.x - 10;
          } else {
              this.fatCopSpeechElement.x = this.fatCop.body.x - 120;
          }
          
          this.fatCopSpeechElement.y = this.fatCop.body.y - 50;
      }

    if (this.fatCop.x >= 1000 || this.fatCop.x <= 250) {
        this.fatCop.body.setVelocityX(-this.fatCop.body.velocity.x);
        this.fatCop.scaleX = this.fatCop.scaleX * -1;
    }
  }

  prepareTileSet ()
  {
    this.platformTiles = commons.getBasicSceneTileSet('tundra');

    this.platformTiles[16][13] = 'ice_block';
    this.platformTiles[17][13] = 'ice_block';

    this.platformTiles[4][13] = 'ice_block';
    this.platformTiles[5][13] = 'ice_block';

    this.platformTiles[3][10] = 'tundra_cliff_left';
    this.platformTiles[4][10] = 'tundra';
    this.platformTiles[5][10] = 'tundra_cliff_right';

    this.platformTiles[6][11] = 'tundra_cliff_left';
    this.platformTiles[7][11] = 'tundra_cliff_right';

    this.drawTundraCliff(5, 20, 8);
    this.drawTundraCliff(9, 13, 6);
    this.drawTundraCliff(20, 23, 3);
    this.drawTundraCliff(2, 5, 3);
    this.drawTundraCliff(16, 18, 5);
    this.drawTundraCliff(21, 23, 11);

    this.platformTiles[9][4] = 'tundra';
    this.platformTiles[23][10] = 'tundra';
    this.platformTiles[23][11] = 'ice_block';
  }

  drawTundraCliff(x1, x2, y) {
    this.platformTiles[x1 - 1][y] = 'tundra_cliff_left';
    for (let i = x1; i <= x2; i++) {
        this.platformTiles[i][y] = 'tundra'
    }
    this.platformTiles[x2 + 1][y] = 'tundra_cliff_right';
}

  renderCollectables() {
    for (let i = 0; i < this.numberOfCollectables; i++) {
        let y_coordinate = -1;
        let x_coordinate = -1;

        let i = 0;

        while (!this.isCollectableCoordinatesValid(x_coordinate, y_coordinate)) {
            y_coordinate = Math.floor(Math.random() * 13);
            x_coordinate = Math.floor(Math.random() * 25);
        }

        if (this.collectables[x_coordinate] == undefined) {
            this.collectables[x_coordinate] = [];
        }

        this.collectables[x_coordinate][y_coordinate] = 1;

        let collectableNumber = Math.floor(Math.random() * 3);

        let collectable = this.physics.add.sprite(x_coordinate * this.tileWidth, y_coordinate * this.tileHeight, this.collectables[collectableNumber]);
        collectable.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, collectable, function() { this.collect(collectable, collectableNumber); }, null, this);
      }
  }

  collect(collectable, number) {
    this.sound.playAudioSprite('sfx', 'ping');

      switch(number) {
          case 0:
            this.score += 5;
            break;
          case 1:
            this.score += 10;
            break;
          case 2:
            this.score += 20;
            break;

      }
        this.updateScore();
        collectable.destroy();
  }

  isCollectableCoordinatesValid(x, y) {
      return x >= 0 &&
      y >= 0 &&
      this.isTileReachableFromPlatform(x, y) &&
      (this.platformTiles[x] == undefined || this.platformTiles[x][y + 1] == undefined) &&
      (this.collectables[x] == undefined || this.collectables[x][y + 1] == undefined);
  }

  isTileReachableFromPlatform(x, y) {
      for (let y_axis = 0; y_axis <= y; y_axis++) {
          for (let x_axis = x - 2; x_axis < x + 2; x_axis++) {
            if (this.platformTiles[x_axis] != undefined && this.platformTiles[x_axis][y_axis] != undefined && x_axis != x) {
                return true;
            }
          }
      }

      for (let y_axis = y - 2; y_axis <= y + 2; y_axis++) {
        for (let x_axis = x - 2; x_axis <= x + 2; x_axis++) {
          if (this.platformTiles[x_axis] != undefined && this.platformTiles[x_axis][y_axis] != undefined) {
              return true;
          }
        }
    }

    return false;
  }

};
