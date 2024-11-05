class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);

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

    // Audios
    this.gameAudio = new Audio("assets/sounds/game-audio.mp3");
    this.correctSound = new Audio("assets/sounds/correct.mp3");
    this.incorrectSound = new Audio("assets/sounds/incorrect.mp3");
    this.clickSound = new Audio("assets/sounds/click.mp3");

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
    restartButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.restartGame();
      });
    });

    const quitButtons = document.querySelectorAll("#quit-button");
    quitButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.quitGame();
      });
    });

    document
      .getElementById("pause-button")
      .addEventListener("click", () => {
        this.clickSound.play();
        this.pause();
      });

    document.getElementById("return-button").addEventListener("click", () => {
      this.resumeGame();
    });

    document.getElementById("ranking").addEventListener("click", () => {
      this.showScores();
      this.clickSound.play();
    });

    // Audio slider
    const volumeSlider = document.getElementById("volume-slider");
    volumeSlider.addEventListener("input", (event) => {
      this.setVolume(event.target.value);
    });
  }

  setVolume(volume) {
    const normalizedVolume = volume / 100;

    // Volume is within [0, 1]
    this.gameAudio.volume = Math.min(Math.max(normalizedVolume, 0), 1);
    this.correctSound.volume = Math.min(Math.max(normalizedVolume, 0), 1);
    this.incorrectSound.volume = Math.min(Math.max(normalizedVolume, 0), 1);
    this.clickSound.volume = Math.min(Math.max(normalizedVolume, 0), 1);
  }

  onKeyEvent(event) {
    if (event.keyCode === SPACE) {
      this.animal.changeType();
    } else {
      this.animal.onKeyDown(event.keyCode);
    }
  }


  // ***********RANKING SYSTEM***********

  saveScore(score) {
    // If there are scores --> convert(parse)  JSON string to Array // If not empty array
    let scores = localStorage.getItem("scores")
      ? JSON.parse(localStorage.getItem("scores"))
      : [];
    

    scores.push(score);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 3);

    // Save current array scores as a JSON string
    localStorage.setItem("scores", JSON.stringify(scores));
  }

  showScores() {
    const rankingScreen = document.getElementById("ranking-screen");
    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "";

    const scores = localStorage.getItem("scores")
      ? JSON.parse(localStorage.getItem("scores"))
      : [];

    scores.forEach((score, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${score} points`;
      rankingList.appendChild(listItem);
    });

    rankingScreen.style.display = "flex";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("pause-screen").style.display = "none";
    this.pause();
  }

  // ***********************************

  // *****GAME SCREENS*****
  startGame() {
    this.isGameRunning = true;
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";

    this.gameAudio.loop = true;
    this.gameAudio.play();

    this.start();
  }

  pause() {
    if (this.isGameRunning && !this.isPaused) {
      this.isPaused = true;
      clearInterval(this.drawIntervalId);
      this.drawIntervalId = undefined;

      this.gameAudio.pause();

      document.getElementById("pause-screen").style.display = "flex";
    }
  }

  gameOver() {
    this.pause();
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "flex";

    document.getElementById("pause-screen").style.display = "none";

    this.saveScore(this.score);
  }
  // ***********************************


  // ++++++ GAME-SCREENS BUTTONS LOGIC ++++++
  resumeGame() {
    if (this.isPaused) {
      this.isPaused = false;

      this.gameAudio.play();
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
    this.gameAudio.currentTime = 0; // Reset audio to the beginning
  }

  quitGame() {
    this.resetGame();
    document.getElementById("start-screen").style.display = "flex";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById("ranking-screen").style.display = "none";

    this.gameAudio.pause();
    this.gameAudio.currentTime = 0;
  }
  // ++++++++++++++++++++++++++++++++++++++

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  start() {
    if (!this.drawIntervalId) {
      this.drawIntervalId = setInterval(() => {
        this.clear();
        this.draw();
        this.move();
        this.checkCollisions();
        this.tick++;

        if (this.tick >= 65) {
          this.tick = 0;
          this.addFood();
        }

        if (this.animal.lives < 0) {
          this.gameOver();
        }
      }, this.fps);
    }
  }

  addFood() {
    // Keep only food that is within canvas
    this.food = this.food.filter((food) => food.y < this.canvas.height);

    const types = ["carrot", "meat", "candy", "bug"];
    const randomFood = types[Math.floor(Math.random() * types.length)];

    const newFood = new Food(this.ctx, randomFood, this.score);
    this.food.push(newFood);
  }

  checkCollisions() {
    this.food = this.food.filter((food) => {
      const isColliding = this.checkFoodCollision(food);
      if (isColliding) {
        if (food.type === "candy") {
          this.score += 30;
          this.correctSound.play();
        } else if (
          (this.animal.type === "dog" && food.type === "meat") ||
          (this.animal.type === "rabbit" && food.type === "carrot")
        ) {
          this.score += 10;
          this.correctSound.play();
        } else {
          this.animal.lives -= 1;
          this.incorrectSound.play(); 
        }
        return false;
      }
      return true;
    });
  }

  checkFoodCollision(food) {
    const animalTop = this.animal.y;
    const animalLeft = this.animal.x;
    const animalRight = this.animal.x + this.animal.width;

    const foodTop = food.y;
    const foodBottom = food.y + food.height;
    const foodLeft = food.x;
    const foodRight = food.x + this.animal.width;

    return (
      foodBottom > animalTop &&
      foodTop < animalTop &&
      foodRight > animalLeft &&
      foodLeft < animalRight
    );
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
      heartImg.src = "assets/img/heart.png";
      livesContainer.appendChild(heartImg);
    }
  }

  move() {
    this.food.forEach((food) => food.move());
  }
}
