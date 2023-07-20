//imports the moongose module
const mongoose = require('mongoose')

//This defines the type of fields for the game object in the mongoDB collection
const gameSchema = new mongoose.Schema({
  board: [String],
  playerX: String,
  playerO: String,
  status: {
    type: String,
    default: "ongoing"
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  winner: String,// Add the winner property
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Move" }]
});



module.exports = mongoose.model("Game", gameSchema);
