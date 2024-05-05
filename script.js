function Gameboard() {
  const row = 3;
  const column = 3;
  const board = [];

  populateBoard();

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

  function populateBoard() {
    for (let i = 0; i < row; i++) {
      board[i] = [];
      for (let j = 0; j < column; j++) {
        board[i].push(Cell());
      }
    }
  }

  function checkWinner(rounds) {
    const winningCombos = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      const [rowA, colA] = a;
      const [rowB, colB] = b;
      const [rowC, colC] = c;

      if (
        board[rowA][colA].getValue() !== 0 &&
        board[rowA][colA].getValue() === board[rowB][colB].getValue() &&
        board[rowA][colA].getValue() === board[rowC][colC].getValue()
      ) {
        return board[rowA][colA].getValue();
      }
    }
    if (board.every((row) => row.every((cell) => cell.getValue() !== 0))) {
      return "Draw";
    }
    return null;
  }

  return { getBoard, addToken, printBoard, checkWinner, populateBoard };
}

function Cell() {
  let value = 0;
  const drawMarker = (player) => {
    value = player;
  };

  const getValue = () => value;
  return { drawMarker, getValue };
}

function Player(name, marker) {
  const getName = () => name;
  const setName = (newName) => {
    name = newName;
  };
  return { getName, setName, marker };
}

function GameController(playerOne = "Player 1", playerTwo = "Player 2") {
  const gameboard = Gameboard();
  const players = [
    Player(playerOne, "O"),
    Player(playerTwo, "X"),
    Player("Draw", "XO"),
  ];

  let activePlayer = players[0];
  let winner = null;
  const setWinner = (state) => {
    if (state === "Draw") {
      winner = players[2];
      return;
    }
    winner = state === "O" ? players[0] : players[1];
  };

  const getWinner = () => winner;
  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    console.log(getWinner());
    if (getWinner()) return;
    gameboard.addToken(row, column, getActivePlayer().marker);
    const winner = gameboard.checkWinner();
    if (winner) {
      setWinner(winner);
      return;
    }
    switchActivePlayer();
  };

  function resetGame() {
    gameboard.populateBoard();
    winner = null;
    activePlayer = players[0];
  }

  return {
    getActivePlayer,
    playRound,
    getBoard: gameboard.getBoard,
    getWinner,
    resetGame,
    changePlayerOne: players[0].setName,
    changePlayerTwo: players[1].setName,
  };
}

function ScreenController() {
  const game = GameController();

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const resetButton = document.querySelector(".reset");
  const changeNames = document.querySelector(".change-names");
  const inputPlayerOne = document.querySelector("#player-one");
  const inputPlayerTwo = document.querySelector("#player-two");

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...'`;
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = columnIndex;
        cellButton.dataset.row = rowIndex;
        cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue();
        if (cell.getValue() != 0) cellButton.disabled = true;
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
    const winner = game.getWinner();
    if (winner) playerTurnDiv.textContent = winner.getName();
  }
  function resetHandlerButton(e) {
    game.resetGame();
    updateScreen();
  }

  function changeNamesHandlerButton() {
    game.changePlayerOne(inputPlayerOne.value);
    game.changePlayerTwo(inputPlayerTwo.value);
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerButton);
  resetButton.addEventListener("click", resetHandlerButton);
  changeNames.addEventListener("click", changeNamesHandlerButton);

  updateScreen();
}
ScreenController();
