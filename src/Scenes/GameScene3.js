import "phaser";
import GameScene from "./GameScene";

export default class GameScene3 extends GameScene {
  constructor() {
    super("Episodio3");
  }

  preload() {
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }


  create() {

    this.registry.set("level", 3);

    this.createMapAndHero("level3");
    this.setCameraMan(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.createIndexCallbacks();
  }

  // method to be executed at each frame
  update() {
    this.hero.update(this.gravityOrientation);
  }
}
