import "phaser";
import config from '../Config/config';


export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
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
    

    // creatin of "level" tilemap
    var map = this.add.tilemap("level");

    // adding tiles (actually one tile) to tilemap
    var tileset = map.addTilesetImage("tileset01", "tile");

    // tile 1 (the black tile) has the collision enabled
    map.setCollision(1);

    // which layer should we render? That's right, "layer01"
    this.backgroundLayer = map.createStaticLayer("layer01", tileset);

    // adding the hero sprite
    var hero = this.physics.add.sprite(300, 376, "hero");
    // setting hero anchor point


    // enabling ARCADE physics for the  hero
 
  
    // setting hero gravity
    hero.body.gravity.y = 0; // config.playerGravity;

    // setting hero horizontal speed
    hero.body.velocity.x = 0;//config.playerSpeed;

    // the hero can jump
    this.canJump = true;

    // the hern cannot double jump
    this.canDoubleJump = false;

    // the hero is not on the wall
    this.onWall = false;

    // set workd bounds to allow camera to follow the player
   // this.world.setBounds(0, 0, 1920, 1440);

    // making the camera follow the player
    
   // game.camera.follow(hero);
    
  }
}
