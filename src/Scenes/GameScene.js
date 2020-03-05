import "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game",{
      key: "games",
      physics: {
        arcade: {
          debug: true
        }
      },
      
    });
  }

  preload() {
    // load images


   // this.scale.scaleMode = ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
 //   this.stage.disableVisibilityChange = true;

    //loading level tilemap
    this.load.tilemapTiledJSON("level", "assets/game/level.json");
    this.load.image("tile", "assets/game/tile.png");
    this.load.image("hero", "assets/game/hero.png");
  }

  create() {
    // starting ARCADE physics
    let gameus = this.game;
    this.add.image(200, 200, 'logoJuego');
    // creatin of "level" tilemap
    this.map = this.game.add.tilemap("level");

    // adding tiles (actually one tile) to tilemap
    this.map.addTilesetImage("tileset01", "tile");

    // tile 1 (the black tile) has the collision enabled
    this.map.setCollision(1);

    // which layer should we render? That's right, "layer01"
    this.layer = this.map.createLayer("layer01");

    // adding the hero sprite
    this.hero = game.add.sprite(300, 376, "hero");

    // setting hero anchor point
    this.hero.anchor.set(0.5);

    // enabling ARCADE physics for the  hero
    game.physics.enable(this.hero, Phaser.Physics.ARCADE);

    // setting hero gravity
    this.hero.body.gravity.y = gameOptions.playerGravity;

    // setting hero horizontal speed
    this.hero.body.velocity.x = gameOptions.playerSpeed;

    // the hero can jump
    this.canJump = true;

    // the hern cannot double jump
    this.canDoubleJump = false;

    // the hero is not on the wall
    this.onWall = false;

    // waiting for player input
    game.input.onDown.add(this.handleJump, this);

    // set workd bounds to allow camera to follow the player
    game.world.setBounds(0, 0, 1920, 1440);

    // making the camera follow the player
    game.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);
    
  }
}
