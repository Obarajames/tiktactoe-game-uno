const express = require("express")
const connectToMongoDB = require("./mongodb")
const gameController = require("./controllers/gameController")
const cors = require("cors")
const makeCells = require("./createCells")


const app = express()

app.use(express.json())
app.use(cors())


connectToMongoDB()

// Create a new game
app.post("/games", gameController.createGame)

// Retrieve game data
app.get("/games", gameController.getGame)

// Update game dat
app.put("/games", gameController.updateGame)

//To build functionality of the game
app.use(makeCells)
//starts an exp server that listens on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 3000")
})
