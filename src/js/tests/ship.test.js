const ship = require('../ship.js');

test('hit subtracts health by 1', () => {
  const testShip5 = ship(5);
  expect(testShip5.getHealth()).toBe(5);
  expect(testShip5.hit()).toBe(4);
  expect(testShip5.getHealth()).toBe(4);
});

test('ships cant be hit below 0 health', () => {
  const testShip1 = ship(1);
  expect(testShip1.getHealth()).toBe(1);
  expect(testShip1.hit()).toBe(0);
  expect(testShip1.hit()).toBe(0);
});

test('length of the ship should be constant once created', () => {
  const testShip5 = ship(5);
  expect(testShip5.getLength()).toBe(5);
});

test('ship isSunk should return false if there is still health left', () => {
  const testShip1 = ship(1);
  expect(testShip1.isSunk()).toBe(false);
});

test('ship isSunk should return true if there is no health left', () => {
  const testShip1 = ship(1);
  testShip1.hit();
  expect(testShip1.isSunk()).toBe(true);
});
