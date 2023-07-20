const Game = require("../models/Game")
const Move = require("../models/moves")
const createCells = require('../createCells')

const createGame = async (req, res) => {
  const { board } = req.body

  try {
    const newGame = new Game({ board })
    const savedGame = await newGame.save()

    res.json(savedGame)
  } catch (err) {
    console.error("Error creating game:", err)
    res.status(500).send("Error creating game")
  }
}

const getGame = async (req, res) => {
  try {
    const game = await Game.findOne({ status: "ongoing" })

    if (game) {
      res.json(game)
    } else {
      const newBoard = createCells().map((cell) => cell.value)
      const newGame = new Game({ board: newBoard })
      const savedGame = await newGame.save()
      res.json(savedGame)
    }
  } catch (err) {
    console.error("Error retrieving game:", err)
    res.status(500).send("Error retrieving game")
  }
}


const updateGame = async (req, res) => {
  const { board } = req.body;

  try {
    const filter = { status: "ongoing" };
    const update = { $set: { board } };
    const options = { new: true };

    let game = await Game.findOneAndUpdate(filter, update, options);

    if (!game) {
      return res.status(404).send("Game not found");
    }

    const winner = checkWinner(board);
    const status = winner ? "completed" : board.every((cell) => cell !== "") ? "draw" : "ongoing";

    game.status = status;
    game.winner = winner; 

    await game.save();

  
    const player = game.moves.length % 2 === 0 ? "O" : "X"; 
    const position = board.findIndex((cell) => cell === player);
    const row = Math.floor(position / 3);
    const column = position % 3;

    const move = new Move({
      game: game._id,
      player,
      row,
      column,
    });

    await move.save();

    game.moves.push(move._id);

    await game.save();

    res.json(game);
  } catch (err) {
    console.error("Error updating game:", err);
    res.status(500).send("Error updating game");
  }
};

const checkWinner = (board) => {
  const winningCombo = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (const [a, b, c] of winningCombo) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] 
    }
  }

  if (!board.includes("")) {
    return "draw" 
  }

  return null 
}


module.exports = { createGame, getGame, updateGame }
