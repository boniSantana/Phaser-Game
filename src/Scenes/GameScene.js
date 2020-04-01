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
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.load.tilemapTiledJSON("level", "level.json");
    this.load.image("tile", "assets/tiles/tile.png");
    this.load.image("hero", "assets/NPCs/hero.png");


    //loading level tilemap
  }

  create() {
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
      this.hero = this.physics.add.sprite(260, 376, "hero");

      // set hero horizontal speed
      this.hero.body.velocity.x = gameOptions.heroSpeed;

      // hero can jump at the moment
      this.canJump = true;

      // hero cannot double jump
      this.canDoubleJump = false;

      // hero is not on the wall
      this.onWall = false;

      // hero is not underwater
      this.isUnderwater = false;

      // hero is on land
      this.isOnLand = true;

      // listener for hero input
      this.input.on("pointerdown", this.handleJump, this);

      // set workd bounds to allow camera to follow the hero
      this.cameras.main.setBounds(0, 0, 1920, 1440);

      // make the camera follow the hero
      this.cameras.main.startFollow(this.hero);
  }

  // method to be executed at each frame
  // method to make the hero jump
  handleJump(){

    // is the hero underwater?
    if(this.isUnderwater){

        // in this case, the hero can jump (let's say swim up) only if not already swimming up
        if(this.hero.body.velocity.y >= 0){

            // apply swim force
            this.hero.body.velocity.y = -gameOptions.underwaterJump;
        }
    }

    // hero is not underwater
    else{

        // hero can jump when:
        // canJump is true AND hero is on the ground (blocked.down)
        // OR
        // hero is on the wall
        if((this.canJump && this.hero.body.blocked.down) || this.onWall){

            // apply jump force
            this.hero.body.velocity.y = -gameOptions.heroJump;

            // is the hero on a wall?
            if(this.onWall){

                // change horizontal velocity too. This way the hero will jump off the wall
                this.setHeroXVelocity(true);
            }

            // hero can't jump anymore
            this.canJump = false;

            // hero is not on the wall anymore
            this.onWall = false;

            // hero can now double jump
            this.canDoubleJump = true;
        }
        else{

            // can the hero double jump?
            if(this.canDoubleJump){

                // hero can't double jump anymore
                this.canDoubleJump = false;

                // apply double jump force
                this.hero.body.velocity.y = -gameOptions.heroDoubleJump;
            }
        }
    }
}

// method to be executed at each frame
update(){

    // check which tile the hero is on
    let tile = this.map.getTileAtWorldXY(this.hero.x, this.hero.y);

    // hero is underwater when over a water tile
    this.isUnderwater = tile != null && tile.index == WATER_TILE;

    // if the hero is underwater...
    if(this.isUnderwater){

        // if the hero is swimming up...
        if(this.hero.body.velocity.y < 0){

            // ... reduce swimming force
            this.hero.body.velocity.y *= 0.9;
        }

        // if the hero is drowning ...
        if(this.hero.body.velocity.y > 0){

            // ... reduce drowning force
            this.hero.body.velocity.y *= 0.97;
        }

        // if the hero is also on the land, this means the hero jumped in the water right now
        if(this.isOnLand){

            // reduce hero vertical velocity
            this.hero.body.velocity.y *= 0.5;

            // hero is no more on land
            this.isOnLand = false;
        }
    }

    // if the hero is not underwater...
    else{

        // the hero is on land
        this.isOnLand = true;
    }

    // apply the proper gravity according to hero being on land or underwater
    this.hero.body.gravity.y = this.isUnderwater ? gameOptions.underwaterGravity : gameOptions.heroGravity;

    // hero is not on wall
    this.onWall = false;

    // method to set hero velocity. Arguments are:
    // * move toward default direction
    // * should hero stop?
    // * is the hero underwater?
    this.setHeroXVelocity(true, false, this.isUnderwater);

    // handle collision between hero and tiles
    this.physics.world.collide(this.hero, this.layer, function(hero, layer){

        // should the hero stop?
        let shouldStop = false;

        // some temporary variables to determine if the hero is blocked only once
        let blockedDown = hero.body.blocked.down;
        let blockedLeft = hero.body.blocked.left;
        let blockedRight = hero.body.blocked.right;

        // if the hero hits something, no double jump is allowed
        this.canDoubleJump = false;

        // hero on the ground
        if(blockedDown){

            // hero can jump
            this.canJump = true;

            // if we are on tile 2 (stop tile)...
            if(layer.index == STOP_TILE){

                // hero should stop
                shouldStop = true;
            }

            // if we are on a trampoline and previous hero vertical velocity was greater than zero...
            if(layer.index == TRAMPOLINE_TILE && this.previousYVelocity > 0){

                // trampoline jump!
                hero.body.velocity.y = -gameOptions.trampolineImpulse;

                // hero can double jump
                this.canDoubleJump = true
            }

        }

        // hero on the ground and touching a wall on the right
        if(blockedRight){

            // horizontal flip hero sprite
            hero.flipX = true;
        }

        // hero on the ground and touching a wall on the right
        if(blockedLeft){

            // default orientation of hero sprite
            hero.flipX = false;
        }

        // hero NOT on the ground and touching a wall but not underwater
        if((blockedRight || blockedLeft) && !blockedDown && !this.isUnderwater){

            // hero on a wall
            hero.scene.onWall = true;

            // remove gravity
            hero.body.gravity.y = 0;

            // set new y velocity
            hero.body.velocity.y = gameOptions.heroGrip;
        }

        // adjust hero speed according to the direction the hero is moving
        this.setHeroXVelocity(!this.onWall || blockedDown, shouldStop, this.isUnderwater);
    }, null, this);

    // save current vertical velocity
    this.previousYVelocity = this.hero.body.velocity.y;

}

// method to set hero horizontal velocity
setHeroXVelocity(defaultDirection, stopIt, underwater){

    // should the hero stop?
    if(stopIt){

        // ... then stop!
        this.hero.body.velocity.x = 0;
    }
    else{

        // set hero speed also checking if the hero is underwater or whether the hero looks left or right
        this.hero.body.velocity.x = (underwater ? gameOptions.underwaterSpeed : gameOptions.heroSpeed) * (this.hero.flipX ? -1 : 1) * (defaultDirection ? 1 : -1);
    }
}

  // method to set hero horizontal velocity
}
