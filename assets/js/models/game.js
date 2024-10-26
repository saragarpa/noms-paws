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
    this.tick = 0;

    this.score = 0;

    this.setListeners();
  }

  setListeners() {
    document.addEventListener('keydown', (event) => {
      this.onKeyEvent(event);
    });
  
    document.addEventListener('keyup', () => {
      this.animal.onKeyUp(); 
    });
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
        this.move();
        this.checkCollisions();
        this.tick++;

        if (this.tick >= 90) {
          this.tick = 0;
          this.addFood();
        }
        
      }, this.fps);
    }
  }

  addFood() {
    // We keep only the food that is within the canvas
    this.food = this.food.filter((food) => food.y < this.canvas.height); 

    const types = ["carrot", "meat", "candy", "bug"];
    const randomFood = types[Math.floor(Math.random() * types.length)];

    const newFood = new Food(this.ctx, randomFood);
    this.food.push(newFood);

    console.log(`Food on canvas: ${this.food.length}`);
  }


  checkCollisions() {
    this.food = this.food.filter((food) => {
      const foodIsColliding = this.animal.collisionsFood(food);
      if (foodIsColliding) {
        this.score += 1; 
        console.log(`Score: ${this.score}`);
      }
    
      return !foodIsColliding; 
  
    });
    
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
    this.food.forEach((food) => food.draw());
  }

  move() {
    this.food.forEach((food) => food.move());
    this.animal.move();
  }
}
