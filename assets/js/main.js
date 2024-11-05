window.addEventListener("load", () => {
  const game = new Game("canvas-game");

  document.getElementById("start-button").addEventListener("click", () => {
    game.clickSound.play();
    game.startGame();
  });
});
