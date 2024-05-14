const createGameBoard = require('./board');
const gameBoardContainer = document.getElementById('board-container');

let isHorizontal = true;
function game() {
  const board1 = createGameBoard(1);
  const board2 = createGameBoard(2);

  function init() {
    board1.init();
    board2.init();
    gameBoardContainer.appendChild(createStartingScreen());
  }

  function getBoard(number) {
    if (number === 2) {
      return board2;
    }
    return board1;
  }
  function attacksPhase(board) {
    clear();

    if (!board1.hasShipsAlive()) {
      transitionScreenReveal(
        `Player 1 has had all their ships sunk! Player 2 wins! Refresh the page to play again.`
      );
      return;
    }
    if (!board2.hasShipsAlive()) {
      transitionScreenReveal(
        `Player 2 has had all their ships sunk! Player 1 wins! Refresh the page to play again.`
      );
      return;
    }

    const displayContainer = document.createElement('div');
    displayContainer.classList.add('display-container');
    displayContainer.textContent = `Player ${board.getBoardNumber()} Choose a Coordinate to Attack!`;
    gameBoardContainer.appendChild(displayContainer);
    gameBoardContainer.appendChild(board.renderGameBoard());
    gameBoardContainer.appendChild(board.renderAttacksBoard());
    const attacksCell = document.querySelectorAll('.attack-cell');
    let targetedCoord = attacksCell[0];
    attacksCell.forEach((e) => {
      e.addEventListener('click', (e) => {
        console.log(e.target.dataset.coord);
        targetedCoord.classList.remove('targeting');
        targetedCoord = e.target;
        e.target.classList.add('targeting');
      });
    });
    const attackConfirmButton = document.createElement('div');
    attackConfirmButton.setAttribute('id', 'attack-confirm-button');
    attackConfirmButton.textContent = 'Confirm Attack';
    attackConfirmButton.addEventListener('click', () => {
      if (board.getAttackedCoords().includes(targetedCoord.dataset.coord)) {
        return `Cannot attack again at ${targetedCoord.dataset.coord}`;
      } else {
        board.addAttackedCoord(targetedCoord.dataset.coord);
        if (board.getBoardNumber() == 1) {
          transitionScreenReveal(
            board1.recordAttack(
              board2.receiveAttack(targetedCoord.dataset.coord),
              targetedCoord.dataset.coord
            )
          );
          console.log(`attacking board 2 at ${targetedCoord.dataset.coord}`);
          attacksPhase(board2);
        } else {
          transitionScreenReveal(
            board2.recordAttack(
              board1.receiveAttack(targetedCoord.dataset.coord),
              targetedCoord.dataset.coord
            )
          );
          console.log(`attacking board 1 at ${targetedCoord.dataset.coord}`);
          attacksPhase(board1);
        }
      }
    });
    gameBoardContainer.appendChild(attackConfirmButton);

    // while (board1.hasShipsAlive() && board2.hasShipsAlive()) {
    //   if (board.getBoardNumber() == 1) {
    //     board = board2;
    //   } else {
    //     board = board1;
    //   }
    // }

    //gameBoardContainer.appendChild(createAttackBoard(board));
  }
  function ShipPlacementPhase(board) {
    clear();
    const displayContainer = document.createElement('div');
    displayContainer.classList.add('display-container');
    displayContainer.textContent = `Player ${board.getBoardNumber()} place your ships then hit confirm!`;
    gameBoardContainer.appendChild(displayContainer);
    gameBoardContainer.appendChild(board.renderGameBoard());
    gameBoardContainer.appendChild(createShipPlacement(board));

    function dragstartHandler(event) {
      event.dataTransfer.setData(
        'text/plain',
        `${event.target.parentElement.id},${isHorizontal}`
      );
    }

    function bindDragStart(target) {
      target.addEventListener('dragstart', dragstartHandler);
    }

    function rotateShips() {
      const ships = document.querySelectorAll('.ship');
      const shipCellContainers = document.querySelectorAll(
        '.ship-cell-container'
      );
      const shipCells = document.querySelectorAll('.ship-cell');
      const shipLabels = document.querySelectorAll('.label');
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
        console.log('rotating..');
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

    function createShipPlacement(board) {
      const shipDiv = document.createElement('div');
      shipDiv.setAttribute('id', 'ships');
      shipDiv.appendChild(createOptionsContainer(board));
      createShipsContainer(shipDiv);
      return shipDiv;
    }

    function createShipsContainer(container) {
      const shipTypes = {
        destroyer: 2,
        carrier: 5,
        submarine: 3,
        cruiser: 3,
        battleship: 4,
      };

      for (const [key, value] of Object.entries(shipTypes)) {
        const shipContainer = document.createElement('div');
        shipContainer.setAttribute('id', `${key}`);
        shipContainer.classList.add('ship', 'ship-horizontal');
        const shipLabel = document.createElement('div');
        shipLabel.classList.add('label');
        shipLabel.setAttribute('title', `${key}`);
        shipLabel.textContent = `${key}`;
        const shipCellContainer = document.createElement('div');
        shipCellContainer.classList.add('ship-cell-container');
        shipCellContainer.setAttribute('draggable', 'true');

        bindDragStart(shipCellContainer);
        for (let i = 0; i < value; i++) {
          const gridCell = document.createElement('div');
          gridCell.classList.add(
            'grid-cell-marker',
            'ship-cell',
            'ship-cell-horizontal'
          );
          shipCellContainer.appendChild(gridCell);
        }
        shipContainer.appendChild(shipLabel);
        shipContainer.appendChild(shipCellContainer);
        container.appendChild(shipContainer);
      }
    }

    function createOptionsContainer(board) {
      const shipOptions = document.createElement('div');
      shipOptions.setAttribute('id', 'ship-options');

      const undoDiv = document.createElement('div');
      undoDiv.setAttribute('id', 'undo');
      undoDiv.textContent = 'Undo';
      shipOptions.appendChild(undoDiv);

      const resetDiv = document.createElement('div');
      resetDiv.setAttribute('id', 'reset');
      resetDiv.textContent = 'Reset';
      shipOptions.appendChild(resetDiv);

      const confirmDiv = document.createElement('div');
      confirmDiv.setAttribute('id', 'confirm');
      confirmDiv.textContent = 'Confirm';
      shipOptions.appendChild(confirmDiv);

      const rotateDiv = document.createElement('div');
      rotateDiv.setAttribute('id', 'rotate');
      rotateDiv.textContent = 'Rotate';
      shipOptions.appendChild(rotateDiv);

      resetDiv.addEventListener('click', () => {
        board.resetBoardPlacements();
      });

      undoDiv.addEventListener('click', () => {
        console.log('undo');
        board.undoLastPlacement();
      });

      confirmDiv.addEventListener('click', () => {
        // if (board1.getOccupiedCoords().length < 16) {
        //   return false;
        // }
        // if (board2.getOccupiedCoords().length < 16) {
        //   return false;
        // }
        console.log('confirm');
        if (board.getBoardNumber() === 1) {
          ShipPlacementPhase(board2);
        } else {
          clear();
          attacksPhase(board1);
          console.log('placements done ready for attacks');
        }
        transitionScreenReveal();
      });

      rotateDiv.addEventListener('click', () => {
        isHorizontal = !isHorizontal;
        rotateShips();
      });
      return shipOptions;
    }
  }

  function createStartingScreen() {
    const startingScreenContainer = document.createElement('div');
    const startButton = document.createElement('div');
    startButton.classList.add('start-button');
    startButton.addEventListener('click', function doSomething() {
      ShipPlacementPhase(board1);
      console.log('Clicked start');
    });
    startingScreenContainer.classList.add('start-container');
    startingScreenContainer.textContent = 'Welcome to Battleship!';
    startButton.textContent = 'start';
    startingScreenContainer.appendChild(startButton);
    return startingScreenContainer;
  }
  function clear() {
    gameBoardContainer.textContent = '';
  }
  function transitionScreenReveal(message = '') {
    const screen = document.getElementById('transition-screen');
    screen.classList.remove('transition-screen-hide');
    screen.classList.add('transition-screen-reveal');
    screen.firstChild.textContent = message;
    const screenButton = document.getElementById('transition-screen-button');
    screenButton.addEventListener('click', () => {
      transitionScreenHide();
    });
  }
  function transitionScreenHide() {
    const screen = document.getElementById('transition-screen');

    screen.classList.remove('transition-screen-reveal');
    screen.classList.add('transition-screen-hide');
  }
  return { init, getBoard };
}

module.exports = game;
