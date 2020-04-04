export default class GameScene extends Phaser.Scene {
  static REDTILE = 2;
  static YELLOWTILE = 3;
  static BLUETILE = 4;

  static GRAVITY_NORMAL = 1;
  static GRAVITY_INVERTED = -1;

  /**
   * @param {string} title 
   */
  constructor(title) {
    super(title);
    this.gravityOrientation = GameScene.GRAVITY_NORMAL;
  }

  invertGravity() {
    return this.gravityOrientation * -1;
  }
}
