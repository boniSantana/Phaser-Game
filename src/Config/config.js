import "phaser";
import GameScene from "../Scenes/GameScene";

export default {
  // width of the game, in pixels
  
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
  // background color
    bgColor: 0x444444,
  
  // player gravity
  playerGravity: 900,

  // player friction when on wall
  playerGrip: 100,

  // player horizontal speed
  playerSpeed: 200,

  // player jump force
  playerJump: 400,

  // player double jump force
  playerDoubleJump: 300,

  loaderPath: 'assets/',

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
  
};
