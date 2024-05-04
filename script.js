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

function GameController(playerOne = "Player 1", playerTwo = "Player2") {
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
  return { getActivePlayer, playRound };
}

const game = GameController();

game.playRound(0, 0);
game.playRound(0, 2);
