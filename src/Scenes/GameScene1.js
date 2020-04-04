import "phaser";
import Player from "../Objects/Player";
import GameScene from "./GameScene";

let trampolin = false;
let haveGravityChange = false;

export default class GameScene1 extends GameScene {
  constructor() {
    super("Episodio1");
  }

  colliderTrampolin() {
    trampolin = true;
    console.log("Entre");
  }

  ColliderYellowTile(hero, tile) {
    this.invertGravity();
    console.log("Anduvo gravedad");
    haveGravityChange = true;
  }

  preload() {
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  door() {
    console.log("Funciono");
    this.scene.start("Episodio2");
  }

  create() {
    // create cursors keys.

    // creation of "level" tilemap
    this.map = this.make.tilemap({
      key: "level",
    });

    // add tiles to tilemap
    let tile = this.map.addTilesetImage("tileset01", "tile");

    // which layers should we render? That's right, "layer01"
    this.layer = this.map.createDynamicLayer("layer01", tile);

    // which tiles will collide? Tiles from 1 to 3. Water won't be checked for collisions
    this.prueba = this.layer.setCollisionBetween(1, 6);
  
    // ¡Inicializamos al heroe en el SpawnPoint! 
    const spawnPoint = this.map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.hero = new Player(this, spawnPoint.x, spawnPoint.y);

    // Para que choque en las paredes
    this.physics.add.collider(this.hero.sprite, this.prueba);

    this.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);

    // make the camera follow the hero
    this.cameras.main.startFollow(this.hero.sprite);

    this.add
      .text(16, 16, "Hola, soy yo.", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0);

    this.layer.setTileIndexCallback(GameScene.REDTILE, this.colliderTrampolin, this);
    this.layer.setTileIndexCallback(GameScene.YELLOWTILE, this.ColliderYellowTile, this);
    this.layer.setTileIndexCallback(4, this.door, this);
  }

  // method to be executed at each frame
  update() {
    this.hero.update(this.gravityOrientation);

    if (trampolin === true) {
      trampolin = false;
      this.hero.sprite.body.setVelocityY(this.gravityOrientation * -500);

      this.hero.expresion(
        this.hero.sprite.x + 10 + 34,
        this.hero.sprite.y - 10 - 34,
        "interrogacion"
      );
    }

    if (haveGravityChange === true) {
      this.physics.world.gravity.y = 600 * this.gravityOrientation;
      this.hero.sprite.setFlipY(this.gravityOrientation === -1 ? true : false);
      haveGravityChange = false;
    }
  }
}
