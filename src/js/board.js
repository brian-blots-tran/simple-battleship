//I need a 10 x 10 grid system
//ships are created alongside the board with 1 of each type (carrier: 5, battleship: 4, cruiser: 3, submarine: 3, destroyer: 2,)

const createShip = require('./ship.js');

function gameBoard(number) {
  const boardNumber = number;
  const coords = [];
  const shipLocations = new Map();
  const ships = new Map();
  const occupiedCoordinates = [];
  const attackedCoordinates = [];
  const attackedCoordinatesThatAreHits = [];
  const occupiedCoordinatesThatAreHits = [];
  const friendlyCoordinatesThatAreMisses = [];
  //initialized board coordinates and ship objects
  function init() {
    //coords
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (let alphabet of alpha) {
      for (let i = 1; i < 11; i++) {
        coords.push(alphabet + i);
      }
    }
    //ships
    // ships.set('carrier', createShip(5));
    // ships.set('battleship', createShip(4));
    // ships.set('cruiser', createShip(3));
    // ships.set('submarine', createShip(3));
    ships.set('destroyer', createShip(2));
  }

  //places a ship based on anchor point and orientation
  function placeShip(ship, startingCoord, isHorizontal = true) {
    //check if ship is already placed
    if (shipLocations.get(ship)) {
      return false;
    }

    //prepare starting coord
    const row = startingCoord.slice(0, 1);
    const col = startingCoord.slice(1);
    console.log(`startingCoord: ${startingCoord}, col: ${col} , row: ${row}`);
    const shipCoords = [startingCoord];
    const shipLength = getShip(ship).getLength();
    //prepare subsequent coords
    if (isHorizontal) {
      for (let i = 1; i < shipLength; i++) {
        if (parseInt(col) + i > 10) {
          shipCoords.splice(0, shipCoords.length);
          for (let i = 1; i <= shipLength; i++) {
            shipCoords.push(row + (10 - shipLength + i));
          }
          break;
        }
        shipCoords.push(row + (parseInt(col) + i));
      }
    } else {
      for (let i = 1; i < getShip(ship).getLength(); i++) {
        if (row.charCodeAt() + i > 74) {
          shipCoords.splice(0, shipCoords.length);
          for (let i = 1; i <= shipLength; i++) {
            shipCoords.push(String.fromCharCode(74 - shipLength + i) + col);
          }
          break;
        }
        shipCoords.push(String.fromCharCode(row.charCodeAt() + i) + col);
      }
    }

    //check if coords overlap with existing ships
    for (let i = 0; i < shipCoords.length; i++) {
      if (occupiedCoordinates.includes(shipCoords[i])) {
        return false;
      }
    }

    occupiedCoordinates.push(...shipCoords);
    //set ship location
    shipLocations.set(ship, shipCoords);
    return true;
  }

  //returns all playable coordinates on the board
  function getCoords() {
    return coords;
  }

  //returns the ship object associated with a ship type
  function getShip(type) {
    return ships.get(type);
  }

  //returns the map containing placed ships and their locations (can be empty if no placed ships)
  function getShipLocations() {
    return shipLocations;
  }

  //returns the list of coordinates of a given ship (can return nothing if ship is not placed)
  function getShipCoords(ship) {
    return shipLocations.get(ship);
  }

  //returns the list of occupied coordinates
  function getOccupiedCoords() {
    return occupiedCoordinates;
  }

  //returns a ship type that occupies the provided coordinate or false if cannot find
  function getShipFromCoordinate(coordinate) {
    for (let [key, value] of shipLocations) {
      if (value.includes(coordinate)) {
        return key;
      }
    }
    return false;
  }

  //creates an array with information about each ship and its health in the form "shipType: health"
  function getShipsStatuses() {
    let shipsStatus = [];
    ships.forEach((value, key, map) => {
      shipsStatus.push(`${key}: ${value.getHealth()}`);
    });
    return shipsStatus;
  }
  function getBoardNumber() {
    return boardNumber;
  }
  //takes a coordinate, determines if it was a hit, miss or repeated attack and returns a message
  function receiveAttack(coordinate) {
    let isShipHere = getShipFromCoordinate(coordinate);

    if (isShipHere) {
      occupiedCoordinatesThatAreHits.push(coordinate);
      ships.get(isShipHere).hit();
      return true;
    }
    friendlyCoordinatesThatAreMisses.push(coordinate);
    return false;
  }

  function renderGameBoard() {
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    gridContainer.setAttribute('id', 'gameBoard');
    function dragoverHandler(event) {
      event.preventDefault();
    }
    function dropHandler(event) {
      [shipBeingPlacedID, isHorizontal] = event.dataTransfer
        .getData('text')
        .split(',');
      isHorizontal = isHorizontal === 'true';

      if (
        placeShip(shipBeingPlacedID, event.target.dataset.coord, isHorizontal)
      ) {
        for (let i = 0; i < occupiedCoordinates.length; i++) {
          const cell = document.querySelectorAll(
            `[data-coord=${occupiedCoordinates[i]}]`
          );
          cell[0].classList.add('occupied');
        }
        //ew way to select the ship container
        document
          .getElementById(shipBeingPlacedID)
          .firstChild.nextElementSibling.classList.add('hidden');
      }
    }
    gridContainer.addEventListener('dragover', dragoverHandler);
    gridContainer.addEventListener('drop', dropHandler);

    for (let i = 0; i < coords.length; i++) {
      const gridCell = document.createElement('div');
      gridCell.classList.add('grid-cell');
      gridCell.setAttribute('data-coord', `${coords[i]}`);
      gridCell.appendChild(document.createTextNode(`${coords[i]}`));
      if (occupiedCoordinatesThatAreHits.includes(coords[i])) {
        gridCell.classList.add('attacked-hit');
      } else if (friendlyCoordinatesThatAreMisses.includes(coords[i])) {
        gridCell.classList.add('attacked');
      } else if (occupiedCoordinates.includes(coords[i])) {
        gridCell.classList.add('occupied');
      }
      gridContainer.appendChild(gridCell);
    }
    return gridContainer;
  }
  function renderAttacksBoard() {
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    gridContainer.setAttribute('id', 'attack-board');

    for (let i = 0; i < coords.length; i++) {
      const gridCell = document.createElement('div');
      gridCell.classList.add('grid-cell', 'attack-cell');
      gridCell.setAttribute('data-coord', `${coords[i]}`);
      gridCell.appendChild(document.createTextNode(`${coords[i]}`));
      if (attackedCoordinatesThatAreHits.includes(coords[i])) {
        gridCell.classList.add('attacked-hit');
      } else if (attackedCoordinates.includes(coords[i])) {
        gridCell.classList.add('attacked');
      }

      gridContainer.appendChild(gridCell);
    }
    return gridContainer;
  }
  function resetBoardPlacements() {
    shipLocations.clear();
    for (let i = 0; i < occupiedCoordinates.length; i++) {
      const cell = document.querySelectorAll(
        `[data-coord=${occupiedCoordinates[i]}]`
      );
      cell[0].classList.remove('occupied');
    }
    occupiedCoordinates.splice(0, occupiedCoordinates.length);

    const hiddenDivs = document.querySelectorAll('.hidden');
    hiddenDivs.forEach(function (element) {
      element.classList.remove('hidden');
    });
  }

  function undoLastPlacement() {
    if (occupiedCoordinates.length == 0) {
      return;
    }
    const lastAddedCoord = occupiedCoordinates[occupiedCoordinates.length - 1];
    const occupiedCells = document.querySelectorAll('.occupied');
    let lastAddedShip;
    let lastCoords = [];
    for (let [key, value] of shipLocations.entries()) {
      console.log(value);
      if (value.includes(lastAddedCoord)) {
        lastAddedShip = key;
      }
    }
    if (!lastAddedShip) {
      console.log('could not find the ship');
      return;
    }
    console.log(lastAddedShip);
    for (let i = 0; i < getShip(lastAddedShip).getLength(); i++) {
      lastCoords.push(occupiedCoordinates.pop());
    }
    occupiedCells.forEach(function (element) {
      if (lastCoords.includes(element.dataset.coord)) {
        element.classList.remove('occupied');
      }
    });
    document
      .getElementById(lastAddedShip)
      .lastElementChild.classList.remove('hidden');
    shipLocations.delete(lastAddedShip);
  }
  function hasShipsAlive() {
    let cumulativeHealth = 0;
    ships.forEach((value, key, map) => {
      cumulativeHealth += value.getHealth();
    });

    if (cumulativeHealth == 0) {
      return false;
    }
    return true;
  }
  function getAttackedCoords() {
    return attackedCoordinates;
  }
  function addAttackedCoord(coord) {
    attackedCoordinates.push(coord);
  }
  function recordAttack(isHit, coord) {
    if (isHit) {
      return `Player ${boardNumber} fired at ${coord} and was a hit!`;
    } else {
      attackedCoordinates.push(coord);
      return `Player ${boardNumber} fired at ${coord} and was a miss!`;
    }
  }
  return {
    init,
    getCoords,
    placeShip,
    receiveAttack,
    getShipLocations,
    getShip,
    getShipCoords,
    getOccupiedCoords,
    getShipsStatuses,
    getBoardNumber,
    renderGameBoard,
    resetBoardPlacements,
    undoLastPlacement,
    hasShipsAlive,
    renderAttacksBoard,
    addAttackedCoord,
    getAttackedCoords,
    recordAttack,
  };
}

module.exports = gameBoard;
