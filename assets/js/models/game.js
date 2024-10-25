class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = 550;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");

    this.drawIntervalId = undefined;
    this.fps = 1000 / 60; // 60 FPS

    this.background = new Background(this.ctx);
    this.animal = new Animal(this.ctx);

    this.food = [];
    this.drawFoodCount = 0;
  }

  onKeyEvent(event) {
    if (event.keyCode === SPACE) {
      this.animal.changeType();
    } else {
      this.animal.onKeyDown(event.keyCode);
    }
  }

  start() {
    if (!this.drawIntervalId) {
      this.drawIntervalId = setInterval(() => {
        this.clear();
        this.draw();
        this.tick++;

        if (this.tick >= 50) {
          this.tick = 0;
          this.addFood();
        }
      }, this.fps);
    }
  }

  stop() {
    clearInterval(this.drawIntervalId);
    this.drawIntervalId = undefined;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.background.draw();
    this.animal.draw();
  }

  move() {}
}
