class Animal {
  constructor(ctx, type = "dog") { //starting animal is "dog"
    this.ctx = ctx;

    this.width = 80;
    this.height = 70;

    // Starting position
    this.x = this.ctx.canvas.width / 2 - this.width / 2;
    this.y = this.ctx.canvas.height * 0.8 - this.height / 2;

    this.type = type; // dog or rabbit
    this.speed = 5;

    // Images
    this.dogImg = new Image();
    this.dogImg.src = "assets/img/dog.png";

    this.rabbitImg = new Image();
    this.rabbitImg.src = "assets/img/bunny.png";

    // Sprite config
    this.frames = 5; // Total frames on spritesheet
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


    this.ctx.drawImage(
      img,
      (this.frameIndex / this.frames) * img.width - 30, // Horizontal
      0, // Verticak
      (1 / this.frames) * img.width, // Width Frame
      img.height, // Height
      this.x,
      this.y,
      this.width,
      this.height
    );

    // Invert image
    

      
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

    } else if (keyCode === KEY_UP && this.y > this.ctx.canvas.height * 0.8 - this.height / 2) {
      this.y -= this.speed;
      this.isMoving = true;
    }

    this.animate();
    this.checkCollision();
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

  checkCollision() {
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.width;
    }
  }
}
