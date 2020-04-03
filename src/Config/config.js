import "phaser";
import GameScene from "../Scenes/GameScene";

export default {
  // width of the game, in pixels

  type: Phaser.AUTO,
  parent: "phaser-example",
  pixelArt: false,
  backgroundColor: "#1d212d",
  width: 800,
  height: 600,
  // background color
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "thegame",
    width: 800,
    height: 600
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false
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
