window.addEventListener('load', () => {
  const game = new Game("canvas-game");

   
   document.getElementById("start-button").addEventListener("click", () => {
    game.startGame(); 
  });
});
