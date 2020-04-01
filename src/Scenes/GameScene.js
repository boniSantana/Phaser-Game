import "phaser";
import config from "../Config/config";
import Player from '../Objects/player';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  create() {
    // create cursors keys.

    // creation of "level" tilemap.
    this.map = this.make.tilemap({ key: "level" });

    // add tiles to tilemap.
    let tile = this.map.addTilesetImage("tileset01", "tile");
    
    // render staticlayer "layer01"
    this.layer = this.map.createStaticLayer("layer01", tile);
    

    // add lyer01 at physic staticgroup.
    this.physics.add.staticGroup("layer01");
    
    // which tiles will collide? Tiles from 1 to 3.
    this.layer.setCollisionBetween(1, 3);

    // add the hero sprite and enable arcade physics for the hero
    this.hero = new Player(this, 100, 100);

    // Para que rebote al saltar


    //
    this.physics.add.collider(this.hero.sprite, this.layer);

    this.cameras.main.setBounds(0, 0, 1920, 1440);

    // make the camera follow the hero
    this.cameras.main.startFollow(this.hero.sprite);

 
  }

  // method to be executed at each frame
  update() {

    let tile = this.map.getTileAtWorldXY(this.hero.x, this.hero.y);
    // hero is underwater when over a water tile
    this.hero.update();
    // check which tile the hero is on


  }

}
