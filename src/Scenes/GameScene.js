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
    this.colliderTrampolin = false;
    this.colliderDesaparecer = false;
    this.stateNormal = true;
    this.spawnPointX = 0;
    this.spawnPointY = 0;
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
    let tileTrap = map.addTilesetImage("Trap", "trap");

    this.layers.push(map.createStaticLayer("layer01", tile));
    this.layers.push(map.createStaticLayer("layer02", tileTrap));

    this.tile = tile;
    this.tileTrap = tileTrap;

    /* BORRAR LUEGO DE DESCUBRIR COMO */
    const GlitterPoint = map.findObject(
      "Objects",
      (obj) => obj.name === "Glitter Point"
    );
    /* ESTO*/

    this.spawnGlitter = this.add.sprite(
      GlitterPoint.x,
      GlitterPoint.y,
      "spawnGlitter"
    );

    this.anims.create({
      key: "spawnGlitter_animation",
      frames: this.anims.generateFrameNumbers("spawnGlitter"),
      frameRate: 12,
      repeat: 1,
    });

    this.anims.create({
      key: "tileTrap_animation",
      frames: this.anims.generateFrameNumbers("tileTrap"),
      frameRate: 12,
      repeat: 1,
    });

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

    this.spawnPointX = spawnPoint.x;
    this.spawnPointY = spawnPoint.y;

    return new Player(this, this.spawnPointX, this.spawnPointY);
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

  timerTileDesaparecer() {
    if (this.colliderDesaparecer === false) {
      console.log("Entre timer");
      this.layers[1].setCollision(1, false);
      this.colliderDesaparecer = true;
    }
  }

  /**
   * @param {TilemapLayer} layer
   */
  setTrampolinCollider(layer) {
    const collider = () => {
      console.log("Entre");
      const heroSize = 34;
      const expressionOffset = 10;

      this.colliderTrampolin = true;

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
  setEnanismoCollider(layer) {
    const gravityValue = 600;

    const collider = () => {
      if (!this.hero.onGreenBlock) {
        this.hero.onGreenBlock = true;

        if (this.stateNormal === true) {
          console.log("Chiquito");
          this.hero.sprite.setScale(0.5);
          this.stateNormal = false;
        } else {
          console.log("Grandote");
          this.hero.sprite.setScale(1);
          this.stateNormal = true;
        }
      }
    };

    layer.setTileIndexCallback(GameScene.TILEENANISMO, collider, this);
  }

  /**
   * @param {TilemapLayer} layer
   */
  setSpawnCollider(layer) {
    const collider = () => {
      const offsetGlitter = 34;
      this.spawnGlitter.anims.play("spawnGlitter_animation", true);
      this.spawnPointX = this.hero.sprite.body.x;
      this.spawnPointY = this.hero.sprite.body.y;
      this.spawnGlitter.setPosition(
        this.hero.sprite.body.x,
        this.hero.sprite.body.y - offsetGlitter
      );
    };

    layer.setTileIndexCallback(GameScene.TILESPAWN, collider, this);
  }

  /**
   * @param {TilemapLayer} layer
   */
  setDoorCollider(layer) {
    const collider = () => {
      const count = this.registry.get("level") + 1;
      console.log("count:", count);
      this.scene.start("Episodio" + count);
    };

    layer.setTileIndexCallback(GameScene.TILEDOOR, collider, this);
  }

  /**
   * @param {TilemapLayer} layer
   */
  setRebornCollider(layer) {
    const collider = () => {
      this.hero.sprite.body.position.x = this.spawnPointX; // ¿funcionará?
    };

    layer.setTileIndexCallback(GameScene.TILEREBORN, collider, this);
  }

  /**
   * @param {TilemapLayer} layer
   */
  setDesaparecerCollider(layer) {
    const collider = () => {
      this.time.delayedCall(4000, this.timerTileDesaparecer, [], this);
      console.log("Collider: Desaparecer");
    };

    layer.setTileIndexCallback(1, collider, this);
    
  }

  createIndexCallbacks() {
    const layer01 = this.layers[0];

    this.setTrampolinCollider(layer01);
    this.setGravedadCollider(layer01);
    this.setDoorCollider(layer01);
    this.setEnanismoCollider(layer01);
    this.setRebornCollider(layer01);
    this.setSpawnCollider(layer01);

    const layer02 = this.layers[1];
    this.setDesaparecerCollider(layer02);
  }

  invertGravity() {
    this.gravityOrientation = this.gravityOrientation * -1;
  }
}
