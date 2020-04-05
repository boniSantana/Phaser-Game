import Player from "../Objects/Player";

let trampolin = false;
let haveGravityChange = false;
let gravityInvert = 1;
export default class GameScene extends Phaser.Scene {
  static TILEPARED = 1; // Negro, pared.
  static TILETRAMPOLIN = 2; // Rojo
  static TILEGRAVEDAD = 3; // Amarillo
  static TILEDOOR = 4; // Celeste
  static TILEENANISMO = 5; // Verde
  static TILESPAWN = 6; // Violeta
  static TILELLAVE = 7; // Naranja
  static TILEDESAPARECER = 8; //Fucsia
  static TILEREBORN = 9; // marron
  static TILEDIEZ = 10; // Cian
  static TILELLAVE = 11; // Magenta
  static GRAVITY_NORMAL = 1;
  static GRAVITY_INVERTED = -1;

  /**
   * @param {string} title
   */
  constructor(title) {
    super(title);
    this.gravityOrientation = this.GRAVITY_NORMAL;
  }


  colliderTrampolin() {
    trampolin = true;
    console.log("Entre");
  }

  ColliderGravedad(hero, tile) {
    this.invertGravity();
    console.log("Anduvo gravedad");
    haveGravityChange = true;
  }

  ColliderDoor() {
    console.log("Funciono");
    this.scene.start("Episodio2");
  }

  ColliderDesaparecer() {
    console.log("ColliderDesaparecer");
  }

  createMapAndHero(key) {
    // creation of "level" tilemap
    this.map = this.make.tilemap({
      key: key
    });

    // add tiles to tilemap
    let tile = this.map.addTilesetImage("tileset01", "tile");

    // which layers should we render? That's right, "layer01"
    this.layer = this.map.createStaticLayer("layer01", tile);
    this.layer2 = this.map.createStaticLayer("layer02", tile);

    // ¡Inicializamos al heroe en el SpawnPoint!
    const spawnPoint = this.map.findObject(
      "Objects",
      obj => obj.name === "Spawn Point"
    );
    
    this.hero = new Player(this, spawnPoint.x, spawnPoint.y);

    this.layer.setCollisionBetween (1, 9);
    this.physics.world.addCollider(this.hero.sprite, this.layer);

    this.layer2.setCollisionBetween (1, 9);
    this.physics.world.addCollider(this.hero.sprite, this.layer2);

  }

  createCameraMan(x,y) {

    this.cameras.main.setBounds(x,y, this.map.widthInPixels, this.map.heightInPixels);

    // make the camera follow the hero
    this.cameras.main.startFollow(this.hero.sprite);
  }

  createIndexCallbacks() {

    this.layer.setTileIndexCallback(GameScene.TILETRAMPOLIN, this.colliderTrampolin, this);
    this.layer.setTileIndexCallback(GameScene.TILEGRAVEDAD, this.ColliderGravedad, this);
    this.layer.setTileIndexCallback(GameScene.TILEDOOR, this.ColliderDoor, this);
    this.layer2.setTileIndexCallback(GameScene.TILEDESAPARECER, this.ColliderDesaparecer, this);

  }

  checkCollidesChanges() {
    if (trampolin === true) {
      trampolin = false;
      this.hero.sprite.body.setVelocityY(this.gravityOrientation * -800);

      this.hero.expresion(
        this.hero.sprite.x + 10 + 34,
        this.hero.sprite.y - 10 - 34,
        "interrogacion"
      );
    }
    // TRAMPOLIN

    if (haveGravityChange === true) {
      this.physics.world.gravity.y = 600 * this.gravityOrientation;
      this.hero.sprite.setFlipY(this.gravityOrientation === this.GRAVITY_INVERTED ? true : false);
      haveGravityChange = false;
    }
  }
  
  invertGravity() {
    return this.gravityOrientation * -1;
  }
}
