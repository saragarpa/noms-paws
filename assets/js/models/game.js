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

    this.isGameRunning = false; // Game doesn't start initially
  }

  setListeners() {
    document.addEventListener("keydown", (event) => {
      if (this.isGameRunning) {
        this.onKeyEvent(event);
      }
    });

    document.addEventListener("keyup", (event) => {
      if (this.isGameRunning) {
        this.animal.onKeyUp(event);
      }
    });
  }

  startGame() {
    this.isGameRunning = true;
    const startScreen = document.getElementById("start-screen");
    startScreen.remove();
    this.start();
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

        if (this.animal.lives <= 0) {
          this.gameOver();
          console.log(`RIP Animal`);
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
        if (food.type === "candy") {
          this.score += 30;
        } else if (food.type === "meat" || food.type === "carrot") {
          this.score += 10;
        }
        console.log(`Score: ${this.score}`);
        console.log(`Lives: ${this.animal.lives}`);

        return false; // Clean food when collides
      }
      return true;
    });
  }

  pause() {
    this.isGameRunning = false; 
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
    this.drawCounters();
  }

  drawCounters() {
    //SCORES
    const scoreContainer = document.getElementById("score");
    scoreContainer.textContent = `SCORE: ${this.score}`;

    // LIVES
    const livesContainer = document.getElementById("lives");
    livesContainer.innerHTML = "";
    livesContainer.textContent = "LIVES: ";

    // Add Heart PNG
    for (let i = 0; i < this.animal.lives; i++) {
      const heartImg = document.createElement("img");
      heartImg.classList.add("heart-icon");
      heartImg.src = "/assets/img/heart.png";
      livesContainer.appendChild(heartImg);
    }
  }

  move() {
    this.food.forEach((food) => food.move());
  }


  gameOver() {
    this.pause(); 

    // Draw game over message
    this.ctx.font = "50px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "GAME OVER",
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    );

    
    // Add game over image BG and image
    
    
  }
}
