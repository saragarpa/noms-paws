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

    this.isGameRunning = false; // Game doesn't start initially
    this.isPaused = false;

    this.setListeners();
  }

  
  setListeners() {
    // Movements Animals
    document.addEventListener("keydown", (event) => {
      if (this.isGameRunning && !this.isPaused) {
        this.onKeyEvent(event);
      }
    });

    document.addEventListener("keyup", (event) => {
      if (this.isGameRunning && !this.isPaused) {
        this.animal.onKeyUp(event);
      }
    });

     // Game Screens Buttons
    const restartButtons = document.querySelectorAll("#restart-button");
    restartButtons.forEach(button => {
      button.addEventListener("click", () => {
        this.restartGame();
      });
    });

    const quitButtons = document.querySelectorAll("#quit-button");
    quitButtons.forEach(button => {
      button.addEventListener("click", () => {
        this.quitGame();
      });
    });

    document.getElementById("pause-button").addEventListener("click", () => {
      this.pause();
    });

    
    document.getElementById("return-button").addEventListener("click", () => {
      this.resumeGame();
    });
  }

  onKeyEvent(event) {
    if (event.keyCode === SPACE) {
      this.animal.changeType();
    } else {
      this.animal.onKeyDown(event.keyCode);
    }
  }


  // *****GAME SCREENS*****
  startGame() {
    this.isGameRunning = true;
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    this.start();
  }


  pause() {
    if (this.isGameRunning && !this.isPaused) {
      this.isPaused = true; 
      clearInterval(this.drawIntervalId);
      this.drawIntervalId = undefined;
      document.getElementById("pause-screen").style.display = "flex"; 
    }
  }

  gameOver() {
    this.pause();
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "flex";
    
    document.getElementById("pause-screen").style.display = "none"; 
  }
  // **********************




  // ++++++ GAME-SCREENS BUTTONS LOGIC ++++++ 
  resumeGame() {
    if (this.isPaused) {
      this.isPaused = false; 
      this.start(); // Continue game
      document.getElementById("pause-screen").style.display = "none"; 
    }
  }

  resetGame() {
    this.pause();

    // Reset all parameters
    this.score = 0;
    this.animal.lives = 3;
    this.food = [];
    this.tick = 0;
    this.animal.x = this.ctx.canvas.width / 2 - this.animal.width / 2;
    this.animal.y = this.ctx.canvas.height * 0.8 - this.animal.height / 2;
    this.animal.frameIndex = 0;

    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("pause-screen").style.display = "none"; 

    // Restart game state
    this.isGameRunning = false;
    this.isPaused = false;
  }
 
  restartGame() {
    this.resetGame();
    this.startGame(); // Starts directly without showing start-screen
  }

  quitGame() {
    this.resetGame();
    document.getElementById("start-screen").style.display = "flex"; 
    document.getElementById("game-over-screen").style.display = "none"; 
  }

  // ++++++++++++++++++++++++++++++++++++++ 



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

        if (this.animal.lives < 0) {
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
    // SCORES
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
}
