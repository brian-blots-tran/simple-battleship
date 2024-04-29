const createGameBoard = require('./board');
const gameBoardContainer = document.getElementById('board-container');
const shipContainer = document.getElementById('ships');

function game() {
  const board1 = createGameBoard();
  const board2 = createGameBoard();
  let currentSelectedCell = '';
  function init() {
    board1.init();
    gameBoardContainer.appendChild(board1.renderGameBoard());
  }
  function getBoard(number) {
    if (number === 2) {
      return board2;
    }
    return board1;
  }
  return { init, getBoard };
}

module.exports = game;
