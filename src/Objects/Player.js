/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */

let timer = false;
let timedEvent2;

/**
 * @typedef {Object} Keys
 * @property {Phaser.Input.Keyboard.Key} up
 * @property {Phaser.Input.Keyboard.Key} left
 * @property {Phaser.Input.Keyboard.Key} down
 * @property {Phaser.Input.Keyboard.Key} right
 * @property {Phaser.Input.Keyboard.Key} w
 * @property {Phaser.Input.Keyboard.Key} a
 * @property {Phaser.Input.Keyboard.Key} s
 * @property {Phaser.Input.Keyboard.Key} d
 */

/**
 * @param {Phaser.Scene} scene
 */
function generateAnims(scene) {
  const expressionAnims = [
    {
      key: "silencio",
      frames: scene.anims.generateFrameNumbers("expresiones", {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: 1,
    },
    {
      key: "exclamacion",
      frames: scene.anims.generateFrameNumbers("expresiones", {
        start: 16,
        end: 23,
      }),
      frameRate: 10,
      repeat: 1,
    },
    {
      key: "interrogacion",
      frames: scene.anims.generateFrameNumbers("expresiones", {
        start: 24,
        end: 31,
      }),
      frameRate: 10,
      repeat: 1,
    },
  ];

  const heroAnims = [
    {
      key: "left",
      frames: scene.anims.generateFrameNumbers("hero", { start: 2, end: 0 }),
      frameRate: 10,
    },
    {
      key: "turn",
      frames: [{ key: "hero", frame: 2 }],
      frameRate: 20,
    },
    {
      key: "right",
      frames: scene.anims.generateFrameNumbers("hero", { start: 2, end: 4 }),
      frameRate: 10,
      repeat: 1,
    },
    {
      key: "up",
      frames: scene.anims.generateFrameNumbers("hero", { start: 5, end: 6 }),
      frameRate: 30,
      repeat: 1,
    },
    {
      key: "down",
      frames: scene.anims.generateFrameNumbers("hero", { start: 7, end: 8 }),
      frameRate: 10,
      repeat: 1,
    },
    {
      key: "sleep",
      frames: scene.anims.generateFrameNumbers("hero", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: 1,
    },
  ];

  return [...expressionAnims, ...heroAnims];
}

/**
 * @class
 */
export default class Player {
  /**
   * @constructor
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   */
  constructor(scene, x, y) {
    this.keys.this.scene = scene;

    const anims = generateAnims(this.scene);

    // Create the animations we need from the player spritesheet
    anims.forEach((anim) => scene.anims.create(anim));

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, "hero", 1)
      .setDrag(1000, 0)
      .setMaxVelocity(300, 400);

    // Track the arrow keys & WASD
    const {
      LEFT,
      RIGHT,
      UP,
      DOWN,
      W,
      A,
      D,
      S,
    } = Phaser.Input.Keyboard.KeyCodes;

    /**
     * @type {Keys}
     */
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      a: A,
      d: D,
      s: S,
    });

    // player.setBounce(0.5);
  }

  canJump(gravityState, onGround, onRoof, keys) {
    const isJumpingKeyPressed = keys.up.isDown || keys.w.isDown;

    const jumpOnGround = gravityState === 1 && onGround && isJumpingKeyPressed;
    const jumpOnRoof = gravityState === -1 && onRoof && isJumpingKeyPressed;

    return jumpOnGround || jumpOnRoof;
  }

  /**
   * @param {boolean} onGround
   * @param {boolean} onRoof
   * @param {Keys} keys
   * @returns {boolean}
   */
  canSleep(onGround, onRoof, keys) {
    // Si toco el piso o el techo  y no estoy tocando ninguna tecla, puedo dormir.
    const notOnAir = onRoof || onGround;
    const anyKeyDown =
      keys.right.isDown ||
      keys.left.isDown ||
      keys.up.isDown ||
      keys.down.isDown ||
      keys.W.isDown ||
      keys.A.isDown ||
      keys.S.isDown ||
      keys.D.isDown;

    return notOnAir && !anyKeyDown;
  }

  onEvent() {
    this.sprite.anims.play("sleep", true);
  }

  update(gravitychange) {
    /**
     * @type {Keys}
     */
    const keys = this.keys;
    const sprite = this.sprite;

    const onGround = sprite.body.blocked.down;
    const onRoof = sprite.body.blocked.up;

    const acceleration = onGround ? 600 : 200;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      sprite.anims.play("left", true);
      sprite.setVelocityX(-acceleration);

      // No need to have a separate set of graphics for running to the left & to the right. Instead
      // we can just mirror the sprite.
    } else if (keys.right.isDown || keys.d.isDown) {
      sprite.anims.play("right", true);
      sprite.setVelocityX(acceleration);
    } else if (keys.down.isDown || keys.s.isDown) {
      sprite.anims.play("down", true);
      sprite.setVelocityX(0);
    } else {
      sprite.setVelocityX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (this.canJump(gravitychange, onGround, onRoof, keys)) {
      console.log("Saltaste!");
      sprite.setVelocityY(-500 * gravitychange);
    }

    if (this.canSleep(onGround, onRoof, keys) && timer === false) {
      timer = true;
      timedEvent2 = this.scene.time.delayedCall(3000, this.onEvent, [], this);
    } else if (
      this.canSleep(onGround, onRoof, keys) === false &&
      timer === true
    ) {
      timer = false;
      timedEvent2.remove();
    }
  }

  eliminarExpresion() {
    console.log("Eliminar expresion");
    this.scene.follow.remove(this.animaExpresion);
    this.animaExpresion.destroy();
  }

  expresion(x, y, name) {
    this.animaExpresion = this.scene.add.sprite(x, y, "expresiones", 1);
    this.animaExpresion.anims.play(name, true);

    this.scene.follow.add(this.animaExpresion, {
      target: this.sprite, // Required.
      offsetX: 20,
      offsetY: -20,
      rotate: false,
      rotateOffset: false,
    });

    this.scene.time.delayedCall(600, this.eliminarExpresion, [], this);
  }

  destroy() {
    this.sprite.destroy();
  }
}
