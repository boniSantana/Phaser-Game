import "phaser";
import FollowPlugin from "phaser-plugin-follow";

export default {
  // width of the game, in pixels
  plugins: {
    scene: [{ key: "FollowPlugin", plugin: FollowPlugin, mapping: "follow" }],
  },
  type: Phaser.AUTO,
  parent: "phaser-example",
  pixelArt: false,
  backgroundColor: "#1d212d",
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "thegame",
 
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: true,
    },
  },
  loaderPath: "assets/",
};
