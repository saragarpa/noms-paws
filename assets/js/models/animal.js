class Animal {
  constructor(ctx, type = "dog") {
    //starting animal is "dog"
    this.ctx = ctx;

    this.width = 80;
    this.height = 70;

    // Starting position
    this.x = this.ctx.canvas.width / 2 - this.width / 2;
    this.y = this.ctx.canvas.height * 0.8 - this.height / 2;

    this.type = type; // dog or rabbit
    this.speed = 8;

    // Images
    this.dogImg = new Image();
    this.dogImg.src = "assets/img/dog.png";

    this.rabbitImg = new Image();
    this.rabbitImg.src = "assets/img/bunny.png";

    // Sprite config
    this.frames = 5; // Total frames on sprite sheet
    this.tick = 0; // Animation counter
    this.frameIndex = 0; // Current animation index

    this.isMoving = false;
    this.facingDirection = "left";
  }

  draw() {
    let img;

    if (this.type === "dog") {
      img = this.dogImg;
    } else {
      img = this.rabbitImg;
    }

    // If facing direction is 'right', mirror the image
    if (this.facingDirection === "right") {
      this.ctx.save(); // Save the current context state before transformations
      this.ctx.scale(-1, 1); // Flip horizontally

      // Draw the image facing "right"
      this.ctx.drawImage(
        img,
        (this.frameIndex / this.frames) * img.width - 30, // Calculate horizontal frame position
        0, // Set vertical position to start from the first row of the sprite sheet
        (1 / this.frames) * img.width, // Set frame width based on total frames
        img.height, // Full image height
        -this.x - this.width, // Adjust x position for the mirrored image
        this.y,
        this.width,
        this.height
      );

      // Restore the context state 
      this.ctx.restore();
    } else {
      // Draw the image facing "left" (default direction)
      this.ctx.drawImage(
        img,
        (this.frameIndex / this.frames) * img.width - 30, 
        0, 
        (1 / this.frames) * img.width, 
        img.height, 
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  animate() {
    this.tick++;

    if (this.tick > 2.5) {
      this.tick = 0;
      // Sprite animation
      this.frameIndex++;

      // Restart frame if there are no more sprite poses
      if (this.frameIndex >= this.frames) {
        this.frameIndex = 0;
      }
    }
  }

  canvasCollision() {
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.width;
    }
  }

  onKeyDown(keyCode) {
    if (keyCode === KEY_RIGHT && this.x + this.width < this.ctx.canvas.width) {
      this.x += this.speed;
      this.isMoving = true;
      this.facingDirection = "right";
    } else if (keyCode === KEY_LEFT && this.x > 0) {
      this.x -= this.speed;
      this.isMoving = true;
      this.facingDirection = "left";
    }

    if (keyCode === KEY_DOWN && this.y + this.height < this.ctx.canvas.height) {
      this.y += this.speed;
      this.isMoving = true;
    } else if (
      keyCode === KEY_UP &&
      this.y > this.ctx.canvas.height * 0.8 - this.height / 2
    ) {
      this.y -= this.speed;
      this.isMoving = true;
    }

    this.animate();
    this.canvasCollision();
  }

  onKeyUp() {
    this.isMoving = false;
    this.frameIndex = 0; // Return to first sprite when character is not moving
  }

  changeType() {
    if (this.type === "dog") {
      this.type = "rabbit";
    } else {
      this.type = "dog";
    }
    this.frameIndex = 0; // When animal changes it starts on the first frame
  }
}
