function Gameboard() {
  const row = 3;
  const column = 3;
  const board = [];

  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < column; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const addToken = (row, column, player) => {
    if (getBoard()[row][column].getValue() != 0) return;
    getBoard()[row][column].drawMarker(player);
  };
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, addToken, printBoard };
}

function Cell() {
  let value = 0;
  const drawMarker = (player) => {
    value = player;
  };

  const getValue = () => value;
  return { drawMarker, getValue };
}

function GameController(playerOne = "Player 1", playerTwo = "Player 2") {
  const gameboard = Gameboard();
  const players = [
    { name: playerOne, marker: 1 },
    { name: playerTwo, marker: 2 },
  ];
  let activePlayer = players[0];
  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printGameState = () => {
    gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (row, column) => {
    gameboard.addToken(row, column, getActivePlayer().marker);
    switchActivePlayer();
    printGameState();
  };

  printGameState();
  return { getActivePlayer, playRound, getBoard: gameboard.getBoard };
}

function ScreenController() {
  const game = GameController();

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...'`;
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = columnIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };
  function clickHandlerButton(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    if (!selectedColumn && !selectedRow) return;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerButton);

  updateScreen();
}
ScreenController();
