class Food {
  constructor(ctx, type) {
    this.ctx = ctx;
    this.type = type;

    this.image = new Image();
    this.image.src = `/assets/img/${type}.png`;

    this.x = Math.random() * (ctx.canvas.width - 50); 
    this.y = 0;

    this.width = 50;
    this.height = 50;

    this.speed = 2;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    this.y += this.speed;
  }
}
