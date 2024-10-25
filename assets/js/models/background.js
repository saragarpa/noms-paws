class Background {
  constructor(ctx) {
    this.ctx = ctx;
    // Positions
    this.x = 0;
    this.y = 0;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;

    this.bgImg = new Image();
    this.bgImg.src = "assets/img/background-01.png";
    
    // Set image dimensions
    this.bgImg.width = this.width;
    this.bgImg.height = this.height;
  }

  draw() {
    this.ctx.drawImage(
      this.bgImg,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }
}
