import "phaser";
import GameScene from "./GameScene";

export default class GameScene2 extends GameScene {
  constructor() {
    super("Episodio2");
  }

  preload() {
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }


  create() {

    this.registry.set("level", 2);

    this.createMapAndHero("level2");
    this.setCameraMan(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.createIndexCallbacks();
  }

  // method to be executed at each frame
  update() {
    this.hero.update(this.gravityOrientation);
  }
}
