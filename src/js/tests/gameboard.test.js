const createBoard = require('../gameBoard.js');
const board = createBoard();
test.skip('fills a board array with 10x10 grid', () => {
  board.initBoard();
  expect(board.getBoard()).toBe();
});

test('places a ship on the board', () => {
  board.placeShip('A1', 'A4');
});
