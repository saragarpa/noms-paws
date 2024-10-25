window.addEventListener('load', () => {
  const game = new Game("canvas-game");

  window.addEventListener('keydown', (event) => {
    game.onKeyEvent(event);
  });

  window.addEventListener('keyup', () => {
    game.animal.onKeyUp(); 
  });

  game.start();
});
