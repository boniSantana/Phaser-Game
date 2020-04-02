/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */

export default class Sprite {
  constructor(scene, x, y, key) {

    this.scene = scene;
    console.log("key:", key);


    // Create the animations we need from the player spritesheet
    const anims = scene.anims;
    anims.create({
      key: "left2",
      frames: anims.generateFrameNumbers(key, { start: 2, end: 0 }),
      frameRate: 10,
      repeat: 1
    });

    anims.create({
      key: "turn2",
      frames: [{ key: key, frame: 2 }],
      frameRate: 20
    });

    anims.create({
      key: "right2",
      frames: anims.generateFrameNumbers(key, { start: 2, end: 4 }),
      frameRate: 10,
      repeat: 1
    });

    anims.create({
      key: "up2",
      frames: anims.generateFrameNumbers(key, { start: 5, end: 6 }),
      frameRate: 30,
      repeat: 1
    });

    anims.create({
      key: "down2",
      frames: anims.generateFrameNumbers(key, { start: 7, end: 8 }),
      frameRate: 10,
      repeat: 1
    });

    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y,key, 1)
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
    } else if (gravityState === -1 && onRoof && (keys.up.isDown || keys.w.isDown)) {
      return true;
    } else {
      return false;
    }
  }

  update(gravitychange) {
    const keys = this.keys;
    const sprite = this.sprite;
    const onGround = sprite.body.blocked.down;
    const onRoof = sprite.body.blocked.up;
    const acceleration = onGround ? 600 : 200;

    // Apply horizontal acceleration when left/a or right/d are applied
    if (keys.left.isDown || keys.a.isDown) {
      sprite.anims.play("left2", true);
      sprite.setAccelerationX(-acceleration);

      // No need to have a separate set of graphics for running to the left & to the right. Instead
      // we can just mirror the sprite.
    } else if (keys.right.isDown || keys.d.isDown) {
      sprite.anims.play("right2", true);
      sprite.setAccelerationX(acceleration);
    } else if (keys.down.isDown || keys.s.isDown) {
      sprite.anims.play("down2", true);
      sprite.setAccelerationX(0);
    } else {
      sprite.setAccelerationX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (this.canJump(gravitychange, onGround, onRoof, keys)) {
      console.log("Gravity change vale:", gravitychange);
      sprite.setVelocityY(-500 * gravitychange);
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
