import "phaser";
import config from "../Config/config";
export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
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

    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
      startFrame: 0,
      endFrame: 8
    });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    // creation of "level" tilemap
    this.map = this.make.tilemap({
      key: "level"
    });

    // add tiles to tilemap
    let tile = this.map.addTilesetImage("tileset01", "tile");

    // which layers should we render? That's right, "layer01"
    this.layer = this.map.createStaticLayer("layer01", tile);

    // which tiles will collide? Tiles from 1 to 3. Water won't be checked for collisions
    this.layer.setCollisionBetween(1, 3);

    // add the hero sprite and enable arcade physics for the hero
    this.hero = this.physics.add.sprite(100, 100, "dude");
    this.hero.setBounce(0.2);
    this.hero.setCollideWorldBounds(true);
    this.hero.body.setGravityY(300);

    this.physics.add.collider(this.hero, this.layer);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.cameras.main.setBounds(0, 0, 1920, 1440);

    // make the camera follow the hero
    this.cameras.main.startFollow(this.hero);
  }

  // method to be executed at each frame
  update() {
    if (this.cursors.left.isDown)
    {
        this.hero.setVelocityX(-160);

        this.hero.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.hero.setVelocityX(160);

        this.hero.anims.play('right', true);
    }
    else
    {
        this.hero.setVelocityX(0);

        this.hero.anims.play('turn');
    }

    if (this.cursors.up.isDown)
    {
        this.hero.setVelocityY(-330);
    }

    // check which tile the hero is on
  }
}
