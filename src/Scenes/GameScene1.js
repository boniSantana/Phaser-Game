import "phaser";
import Player from "../Objects/Player";
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
    // create cursors keys.

    this.createMapAndHero("level");

    this.createCameraMan (0,0);

    this.createIndexCallbacks();
  

    this.add
      .text(16, 16, "Hola, soy yo.", {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff",
      })
      .setScrollFactor(0);
  
  }

  // method to be executed at each frame
  update() {
    this.hero.update(this.gravityOrientation);

    this.checkCollidesChanges();
  }
}
