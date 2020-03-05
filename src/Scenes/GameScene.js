import "phaser";
import config from "../Config/config";

const STOP_TILE = 2;
const TRAMPOLINE_TILE = 3;
const WATER_TILE = 4;

var cursors;

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
    this.load.image("hero", "assets/game/hero.png");
  }

  create() {
    // creation of "level" tilemap
    cursors = this.input.keyboard.createCursorKeys();

    this.map = this.make.tilemap({
      key: "level"
    });

    // add tiles to tilemap
    let tile = this.map.addTilesetImage("tileset01", "tile");

    // which layers should we render? That's right, "layer01"
    this.layer = this.map.createStaticLayer("layer01", tile);

    // which tiles will collide? Tiles from 1 to 3. Water won't be checked for collisions
    this.layer.setCollisionBetween(1, 4);

    // add the hero sprite and enable arcade physics for the hero
    this.hero = this.physics.add.sprite(260, 376, "hero");

    // set hero horizontal speed
    this.hero.body.velocity.x = 0;

    // set workd bounds to allow camera to follow the hero
    this.cameras.main.setBounds(0, 0, 1920, 1440);

    // make the camera follow the hero
    this.cameras.main.startFollow(this.hero);
  }

  // method to be executed at each frame
  update() {
    if (cursors.left.isDown) {
      this.hero.body.velocity.x = -160;
      this.hero.flipX = true;
    } else if (cursors.right.isDown) {
      this.hero.body.velocity.x = 160;
      this.hero.flipX = false;
    } else {
      this.hero.body.velocity.x = 0;
    }

    if (cursors.up.isDown) {
      this.hero.body.velocity.y = -330;
    }

    // handle collision between hero and tiles

    this.physics.world.collide(
      this.hero,
      this.layer,
      function(hero, layer) {
        // should the hero stop?
        let shouldStop = false;

        // some temporary variables to determine if the hero is blocked only once
        let blockedDown = hero.body.blocked.down;
        let blockedLeft = hero.body.blocked.left;
        let blockedRight = hero.body.blocked.right;

        // if the hero hits something, no double jump is allowed
        this.canDoubleJump = false;

        // hero on the ground
        if (blockedDown) {
          // hero can jump
          this.canJump = true;

          // if we are on tile 2 (stop tile)...
          if (layer.index == STOP_TILE) {
            // hero should stop
            shouldStop = true;
          }

          // if we are on a trampoline and previous hero vertical velocity was greater than zero...
          if (layer.index == TRAMPOLINE_TILE && this.previousYVelocity > 0) {
            // trampoline jump!
            hero.body.velocity.y = -gameOptions.trampolineImpulse;

            // hero can double jump
            this.canDoubleJump = true;
          }
        }

        // hero on the ground and touching a wall on the right
        if (blockedRight) {
          // horizontal flip hero sprite
          hero.flipX = true;
        }

        // hero on the ground and touching a wall on the right
        if (blockedLeft) {
          // default orientation of hero sprite
          hero.flipX = false;
        }

        // hero NOT on the ground and touching a wall but not underwater
        if (
          (blockedRight || blockedLeft) &&
          !blockedDown &&
          !this.isUnderwater
        ) {
          // hero on a wall
          hero.scene.onWall = true;

          // remove gravity
          hero.body.gravity.y = 0;

          // set new y velocity
          hero.body.velocity.y = gameOptions.heroGrip;
        }

        // adjust hero speed according to the direction the hero is moving
        this.setHeroXVelocity(
          !this.onWall || blockedDown,
          shouldStop,
          this.isUnderwater
        );
      },
      null,
      this
    );
  }

  // method to set hero horizontal velocity
}
