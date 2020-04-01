import "phaser";
import GameScene from "../Scenes/GameScene";

export default {
  // width of the game, in pixels

  type: Phaser.AUTO,
  backgroundColor: 0x444444,
  parent: "phaser-example",
  width: 640,
  height: 480,
  // background color
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "thegame",
    width: 640,
    height: 480
  },
  physics: {
    default: "arcade",
    arcade: {
      
      


      gravity: {
        y: 0
      }
    }
  },

  // hero gravity
  heroGravity: 900,

  // gravity when underwater
  underwaterGravity: 30,

  // hero friction when on wall
  heroGrip: 100,

  // hero horizontal speed
  heroSpeed: 200,

  // hero horizontal speed when underwater
  underwaterSpeed: 50,

  // hero jump force
  heroJump: 400,

  // hero jump force when underwater
  underwaterJump: 300,

  // hero double jump force
  heroDoubleJump: 300,

  // trampoline tile impulse
  trampolineImpulse: 500,

  loaderPath: "assets/"
};
