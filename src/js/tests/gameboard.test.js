const createBoard = require('../board.js');
const board = createBoard();
board.init();
test.skip('fills a board array with 10x10 grid and creates ships', () => {
  expect(board.init()).toBe();
});

test('gets a ship from list of ships', () => {
  expect(board.getShip('carrier').getHealth()).toBe(5);
  expect(board.getShip('destroyer').getHealth()).toBe(2);
  expect(board.getShip('submarine').getHealth()).toBe(3);
  expect(board.getShip('cruiser').getHealth()).toBe(3);
  expect(board.getShip('battleship').getHealth()).toBe(4);
});

test('places a ship on the board horizontally', () => {
  expect(board.placeShip('cruiser', 'A1')).toBe(true);
  expect(board.getShipCoords('cruiser')).toEqual(['A1', 'A2', 'A3']);
});

test('place a ship vertically', () => {
  expect(board.placeShip('battleship', 'C1', false)).toBe(true);
  expect(board.getShipCoords('battleship')).toEqual(['C1', 'D1', 'E1', 'F1']);
});

test('tries to place a already placed ship horizontally', () => {
  expect(board.placeShip('destroyer', 'B1')).toBe(true);
  expect(board.placeShip('destroyer', 'B1')).toBe(false);
  expect(board.getShipCoords('destroyer')).toEqual(['B1', 'B2']);
});

test.skip('tries to place a ship out of bounds horizontally', () => {
  expect(board.placeShip('carrier', 'B7')).toBe(false);
  expect(board.placeShip('carrier', 'B8')).toBe(false);
  expect(board.placeShip('carrier', 'B9')).toBe(false);
  expect(board.placeShip('carrier', 'B10')).toBe(false);
});

test.skip('tries to place a ship out of bounds vertically', () => {
  expect(board.placeShip('carrier', 'I1', false)).toBe(false);
  expect(board.placeShip('carrier', 'J1', false)).toBe(false);
  expect(board.placeShip('carrier', 'I1', true)).toBe(true);
});
test('tries to place a ship in an already occupied place', () => {
  expect(board.placeShip('submarine', 'I1')).toBe(false);
});

test('gets every coord occupied by a ship', () => {
  //expect(board.getOccupiedCoords()).toBe();
  console.log(board.getShipLocations());
  console.log(board.getOccupiedCoords());
});

test('receives attack and is a hit on a ship', () => {
  expect(board.receiveAttack('A1')).toBe('Attack at A1 was a hit');
});

test('receives attack and is a repeated attack after a hit', () => {
  expect(board.receiveAttack('A1')).toBe('Cannot attack again at A1');
});

test('receives attack and is a miss on a ship', () => {
  expect(board.receiveAttack('D3')).toBe('Attack at D3 was a miss');
});

test('receives attack and is a repeated attack after a miss', () => {
  expect(board.receiveAttack('D3')).toBe('Cannot attack again at D3');
});

test('receives attack and is a hit that sunk the ship', () => {
  board.receiveAttack('A2');
  expect(board.receiveAttack('A3')).toBe(
    'Attack at A3 was a hit and sunk the enemy cruiser'
  );
  console.log(board.getShipsStatuses());
});
