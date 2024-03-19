const createShip = require('./ship.js');
function gameBoard() {
  const coords = [];
  const shipLocations = new Map();
  const ships = new Map();

  const shipTypes = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };

  function getCoords() {
    return coords;
  }

  function getShipLocations() {
    return shipLocations;
  }

  function init() {
    //coords
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (let alphabet of alpha) {
      for (let i = 1; i < 11; i++) {
        coords.push(alphabet + i);
      }
    }
    //ships
    for (const [key, value] of shipTypes) {
      ships.set(key, createShip(value));
    }
  }

  function placeShip(shipType, startingCoord, isHorizontal = true) {
    const [row, col] = startingCoord.split('');
    const shipCoords = [startingCoord];
    if (isHorizontal) {
      for (let i = 1; i < ship.getLength(); i++) {
        if (parseInt(col) + i > 10) return false;
        shipCoords.push(row + (parseInt(col) + i));
      }
    } else {
      for (let i = 1; i < ship.getLength(); i++) {
        if (row.charCodeAt() + i > 74) return false;
        shipCoords.push(String.fromCharCode(row.charCodeAt() + i) + col);
      }
    }
    shipLocations.set(shipType, shipCoords);
    return true;
  }

  function receiveAttack(coordinate) {}

  return { init, getCoords, placeShip, receiveAttack, getShipLocations };
}
const board = gameBoard();
board.initCoords();
console.log(board.getCoords());
board.placeShip('cruiser', 'B1', true);
console.log(board.placeShip('cruiser', 'B9', true));
shipsMap = board.getPlacedShips();
console.log(shipsMap.get('cruiser'));
module.exports = gameBoard;
