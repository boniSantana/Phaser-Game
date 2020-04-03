/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
let timer = false;
let timedEvent;
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    
    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: "left",
      frames: anims.generateFrameNumbers("hero", { start: 2, end: 0 }),
      frameRate: 10,
    });

    anims.create({
      key: "turn",
      frames: [{ key: "hero", frame: 2 }],
      frameRate: 20
    });

    anims.create({
      key: "right",
      frames: anims.generateFrameNumbers("hero", { start: 2, end: 4 }),
      frameRate: 10,
      repeat: 1
    });

    anims.create({
      key: "up",
      frames: anims.generateFrameNumbers("hero", { start: 5, end: 6 }),
      frameRate: 30,
      repeat: 1
    });

    anims.create({
      key: "down",
      frames: anims.generateFrameNumbers("hero", { start: 7, end: 8 }),
      frameRate: 10,
      repeat: 1
    });

    anims.create({
      key: "sleep",
      frames: anims.generateFrameNumbers("hero", { start: 9, end: 11 }),
      frameRate: 10,
      repeat: 1
    });

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
      S
    } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      a: A,
      d: D,
      s: S
    });

    // player.setBounce(0.5);
  }

  canJump(gravityState, onGround, onRoof, keys) {
    if (gravityState === 1 && onGround && (keys.up.isDown || keys.w.isDown)) {
      return true;
    } else if (
      gravityState === -1 &&
      onRoof &&
      (keys.up.isDown || keys.w.isDown)
    ) {
      return true;
    } else {
      return false;
    }
  }

  canSleep(onGround, onRoof, keys) {
    // Si toco el piso o el techo  y no estoy tocando ninguna tecla, puedo dormir.
    if (
      (onRoof || onGround) &&
      !keys.right.isDown &&
      !keys.left.isDown &&
      !keys.up.isDown &&
      !keys.down.isDown &&
      !keys.w.isDown &&
      !keys.s.isDown &&
      !keys.a.isDown &&
      !keys.d.isDown
    ) {
      return true;
    } else {
      return false;
    }
  }

  onEvent() {
    console.log("Te dormiste!");
    this.sprite.anims.play("sleep", true);
  }

  update(gravitychange) {
    const keys = this.keys;
    const sprite = this.sprite;
    const onGround = sprite.body.blocked.down;
    const onRoof = sprite.body.blocked.up;
    const acceleration = onGround ? 600 : 200;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      sprite.anims.play("left", true);
      sprite.setAccelerationX(-acceleration);

      // No need to have a separate set of graphics for running to the left & to the right. Instead
      // we can just mirror the sprite.
    } else if (keys.right.isDown || keys.d.isDown) {
      sprite.anims.play("right", true);
      sprite.setAccelerationX(acceleration);
    } else if (keys.down.isDown || keys.s.isDown) {
      sprite.anims.play("down", true);
      sprite.setAccelerationX(0);
    } else {
      sprite.setAccelerationX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (this.canJump(gravitychange, onGround, onRoof, keys)) {
      console.log("Saltaste!");
      sprite.setVelocityY(-500 * gravitychange);
    }

    if (this.canSleep(onGround, onRoof, keys) && timer === false) {
      timer = true;
      timedEvent = this.scene.time.delayedCall(3000, this.onEvent, [], this);
    } 
    else if (this.canSleep(onGround, onRoof, keys) === false && timer === true) {
      timer = false;
      timedEvent.remove();
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
