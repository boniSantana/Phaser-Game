import Player from "../Objects/Player";

let trampolin = false;

/**
 * @typedef {Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer} TilemapLayer
 */

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
    this.gravityOrientation = GameScene.GRAVITY_NORMAL;

    /**
     * @type {TilemapLayer[]}
     */
    this.layers = [];
  }

  /**
   * @param {string} key
   */
  createMapAndHero(key) {
    this.map = this.createMap(key);
    this.hero = this.createHeroAtSpawnPoint(this.map);

    this.setCollisions();
  }

  /**
   * @param {string} key
   * @returns {Phaser.Tilemaps.Tilemap}
   */
  createMap(key) {
    // creation of "level" tilemap
    const map = this.make.tilemap({ key: key });

    // add tiles to tilemap
    let tile = map.addTilesetImage("tileset01", "tile");

    this.layers.push(map.createStaticLayer("layer01", tile));
    this.layers.push(map.createStaticLayer("layer02", tile));

    return map;
  }

  /**
   * @param {Phaser.Tilemaps.Tilemap} map
   */
  createHeroAtSpawnPoint(map) {
    // ¡Inicializamos al heroe en el SpawnPoint!
    const spawnPoint = map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );

    return new Player(this, spawnPoint.x, spawnPoint.y);
  }

  setCollisions() {
    const layer01 = this.layers[0];
    layer01.setCollisionBetween(1, 9);
    this.physics.world.addCollider(this.hero.sprite, layer01);

    const layer02 = this.layers[1];
    layer02.setCollisionBetween(1, 9);
    this.physics.world.addCollider(this.hero.sprite, layer02);
  }

  setCameraMan(x, y, width, height) {
    this.cameras.main.setBounds(x, y, width, height);
    this.cameras.main.startFollow(this.hero.sprite); // make the camera follow the hero
  }

  /**
   * @param {TilemapLayer} layer
   */
  setTrampolinCollider(layer) {
    const collider = () => {
      console.log("Entre");
      const heroSize = 34;
      const expressionOffset = 10;
      const jumpHeight = 400;

      this.hero.sprite.body.setVelocityY(this.gravityOrientation * -jumpHeight);

      this.hero.expresion(
        this.hero.sprite.x + expressionOffset + heroSize,
        this.hero.sprite.y - expressionOffset - heroSize,
        "interrogacion"
      );
    };

    layer.setTileIndexCallback(GameScene.TILETRAMPOLIN, collider, this);
  }

  /**
   * @param {TilemapLayer} layer
   */
  setGravedadCollider(layer) {
    const gravityValue = 600;

    const collider = () => {
      this.invertGravity();
      this.physics.world.gravity.y = gravityValue * this.gravityOrientation;
      this.hero.sprite.setFlipY(
        this.gravityOrientation === GameScene.GRAVITY_INVERTED
      );
    };

    layer.setTileIndexCallback(GameScene.TILEGRAVEDAD, collider, this);
  }

  /**
   * @param {TilemapLayer} layer
   */
  setDoorCollider(layer) {
    const collider = () => {
      console.log("Funciono");
      this.scene.start("Episodio2");
    };

    layer.setTileIndexCallback(GameScene.TILEDOOR, collider, this);
  }

  /**
   * @param {TilemapLayer} layer
   */
  setDesaparecerCollider(layer) {
    const collider = () => {
      console.log("ColliderDesaparecer");
    };

    layer.setTileIndexCallback(GameScene.TILEDESAPARECER, collider, this);
  }

  createIndexCallbacks() {
    const layer01 = this.layers[0];

    this.setTrampolinCollider(layer01);
    this.setGravedadCollider(layer01);
    this.setDoorCollider(layer01);

    const layer02 = this.layers[1];
    this.setDesaparecerCollider(layer02);
  }

  invertGravity() {
    this.gravityOrientation = this.gravityOrientation * -1;
  }
}
