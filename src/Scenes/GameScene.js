import "phaser";
import config from "../Config/config";
import Player from "../Objects/player";
import Sprite from "../Objects/sprite";

const REDTILE = 2;
const YELLOWTILE = 3;
const BLUETILE = 4;
let trampolin = false;
let gravityInvert = 1;
let haveGravityChange = false;
let spriteIsAlived = false;
function ColliderRedTile(hero, tile) {
  console.log("Anduvo trampolin");
  trampolin = true;
}

function ColliderYellowTile(hero, tile) {
  gravityInvert = gravityInvert * -1;
  console.log("Anduvo gravedad");
  haveGravityChange = true;
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  // Track the arrow keys & WASD

  preload() {
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  create() {
    // create cursors keys.

    // creation of "level" tilemap
    this.map = this.make.tilemap({
      key: "level"
    });

    var image = this.add.image(300, 1273, "bigMirror");
    // add tiles to tilemap
    let tile = this.map.addTilesetImage("tileset01", "tile");

    // which layers should we render? That's right, "layer01"
    this.layer = this.map.createStaticLayer("layer01", tile);

    // which tiles will collide? Tiles from 1 to 3. Water won't be checked for collisions
    this.layer.setCollisionBetween(1, 6);

    // ¡Agregamos al heroe!
    this.hero = new Player(this, 100, 100);

    // Para que choque en las paredes
    this.physics.add.collider(this.hero.sprite, this.layer);

    this.cameras.main.setBounds(0, 0, 1920, 1440);

    // make the camera follow the hero
    this.cameras.main.startFollow(this.hero.sprite);
  }

  // method to be executed at each frame
  update() {
    this.hero.update(gravityInvert);
    this.layer.setTileIndexCallback(REDTILE, ColliderRedTile, this);
    this.layer.setTileIndexCallback(YELLOWTILE, ColliderYellowTile, this);

    if (trampolin === true) {
      this.hero.sprite.body.setVelocityY(gravityInvert * -500);
      trampolin = false;
    }

    if (haveGravityChange === true) {
      this.hero.sprite.body.gravity.y = 600 * gravityInvert;
      this.hero.sprite.setFlipY(gravityInvert === -1 ? true : false);
      haveGravityChange = false;
    }

    //console.log("X: ", this.hero.sprite.body.position.x, " Y: ", this.hero.sprite.body.position.y);
    if (spriteIsAlived === true) {
      this.mirrorEnemy.update(gravityInvert);
    }

    if (
      this.hero.sprite.body.position.x <= 487 &&
      this.hero.sprite.body.position.y <= 1371
    ) {
      if (spriteIsAlived === false) {
        console.log("Make sprite");
        this.mirrorEnemy = new Sprite(this, 487, 1370, "mirrorCopy");
        this.physics.add.collider(this.mirrorEnemy.sprite, this.layer);

        spriteIsAlived = true;
      }
    } else if (spriteIsAlived === true) {
      this.mirrorEnemy.destroy();
      spriteIsAlived = false;
      console.log("Kill sprite");
    }
  }
}
