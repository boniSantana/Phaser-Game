import "phaser";
import GameScene from "./GameScene";

export default class GameScene1 extends GameScene {
  constructor() {
    super("Episodio1");
  }

  preload() {
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  create() {
    this.registry.set("level", 1);

    this.createMapAndHero("level");

    this.setCameraMan(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.createIndexCallbacks();
  }

  // method to be executed at each frame
  update() {
    const jumpHeight = 400;
    this.hero.update(this.gravityOrientation);

    if (this.colliderTrampolin === true) {
      this.colliderTrampolin = false;
      this.hero.sprite.body.setVelocityY(this.gravityOrientation * -jumpHeight);
    }


    if (
      this.hero.heroTile != GameScene.TILEENANISMO &&
      this.hero.sprite.body.blocked.down
    ) {
      this.hero.onGreenBlock = false;
    }
  }
}
