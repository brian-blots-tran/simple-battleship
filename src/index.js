import * as createGame from './js/game.js';
const battleshipGame = createGame();
const shipContainers = document.querySelectorAll('.ship-cell-container');
const shipCellContainers = document.querySelectorAll('.ship-cell-container');
const shipCells = document.querySelectorAll('.ship-cell');
const shipLabels = document.querySelectorAll('.label');
const ships = document.querySelectorAll('.ship');
let isHorizontal = true;
battleshipGame.init();

function dragstartHandler(event) {
  event.dataTransfer.setData(
    'text/plain',
    `${event.target.parentElement.id},${isHorizontal}`
  );
}

function bindDragStart(target) {
  target.addEventListener('dragstart', dragstartHandler);
}

shipContainers.forEach(function (value, key) {
  bindDragStart(value);
});

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
  battleshipGame.getBoard().resetBoardPlacements();
});

const undoButton = document.getElementById('undo');
undoButton.addEventListener('click', () => {
  console.log('undo');
  battleshipGame.getBoard().undoLastPlacement();
});

const confirmButton = document.getElementById('confirm');
confirmButton.addEventListener('click', () => {
  console.log('confirm');
});

const rotateButton = document.getElementById('rotate');
rotateButton.addEventListener('click', () => {
  isHorizontal = !isHorizontal;
  rotateShips();
});

function rotateShips() {
  if (!isHorizontal) {
    shipCellContainers.forEach(function (element) {
      element.classList.add('ship-cell-container-rotated');
    });
    shipCells.forEach(function (element) {
      element.classList.remove('ship-cell-horizontal');
      element.classList.add('ship-cell-vertical');
    });
    shipLabels.forEach(function (element) {
      element.classList.add('label-rotated');
    });
    ships.forEach(function (element) {
      element.classList.remove('ship-horizontal');
      element.classList.add('ship-vertical');
    });
  } else {
    shipCellContainers.forEach(function (element) {
      element.classList.remove('ship-cell-container-rotated');
    });
    shipCells.forEach(function (element) {
      element.classList.add('ship-cell-horizontal');
      element.classList.remove('ship-cell-vertical');
    });
    shipLabels.forEach(function (element) {
      element.classList.remove('label-rotated');
    });
    ships.forEach(function (element) {
      element.classList.add('ship-horizontal');
      element.classList.remove('ship-vertical');
    });
  }
}
