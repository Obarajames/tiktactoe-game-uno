import React, { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import TurnIndicator from "./components/TurnIndicator"
import RstButton from "./components/RstButton"
import ExitBtn from "./components/ExitButton"
import Cells from "./components/Cells"
import axios from "axios"

function App() {
  const [cells, setCells] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [Xturn, setXturn] = useState(true)
  const [win, setWin] = useState(false)
  const [draw, setDraw] = useState(false)
  const [winner, setWinner] = useState("")
  const [winningCells, setWinningCells] = useState("")
  const [gameStatus, setGameStatus] = useState(false)

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


 useEffect(() => {
  axios
    .get("http://localhost:5000/games")
    .then((response) => {
      const { board, status } = response.data
      setCells(board.map((value, index) => ({ value, id: index, clicked: !!value })))

      if (status === "completed" && !board.some(cell => cell === "")) {
        setDraw(true)
        setWinner("")
      }
    })
    .catch((error) => {
      console.error("Error retrieving game:", error)
    })
}, [])

 
  function createCells() {
    const cellsArray = []

    for (let i = 0; i < 9 ;i++) {
      cellsArray.push({
        value: "",
        id: i,
        clicked: false,
      })
    }
    return cellsArray
  }

  function cellClick(id) {
    
    
    setGameStatus(true);
    setCells((prevCells) => {
      let currentPlayer = Xturn ? "X" : "O";
  
      const newCells = prevCells.map((cell) => {
        if (cell.id === id && !cell.clicked && !win) {
          currentPlayer = Xturn ? "X" : "O";
          setXturn((prev) => !prev);
          return {
            ...cell,
            value: currentPlayer,
            clicked: true,
          };
        }
        return cell;
      });
  
      axios
        .put("http://localhost:3000/games", {
          board: newCells.map((cell) => cell.value),
          Xturn: currentPlayer, 
        })
        .catch((error) => {
          console.error("Error updating game:", error);
        });
  
      checkWinner(newCells);
  
      return newCells;
    });
  }
  
  
  function checkWinner(cells) {
    const options = cells.map((cell) => cell.value)
    for (let i of winningCombo) {
      let [a, b, c] = i
      if (
        options[a] &&
        options[a] === options[b] &&
        options[a] === options[c]
      ) {
        setWin(true)
        setGameOver(true)
        setWinner(options[a])
        setWinningCells([a, b, c])
      }
    }
    if (!options.includes("") && !win) {
      setDraw(true)
      setGameOver(true)
    }
  }
  

  function restart() {
    
  
    axios
      .post("http://localhost:3000/games", {
        board: createCells().map((cell) => cell.value),
      })
      .then((response) => {
        const { board } = response.data
        setCells(board.map((value, index) => ({ value, id: index, clicked: !!value })))
      })
      .catch((error) => {
        console.error("Error creating game:", error)
      })
  
    setGameOver(false)
    setDraw(false)
    setWin(false)
    setWinningCells("")
    setXturn(true)
    setGameStatus(false)
  }
  
  function exit() {
    window.close()
    console.log("Exit button clicked")
  }

  const boxes = cells.map((cellInfo) => (
    <Cells
      key={nanoid()}
      value={cellInfo.value}
      id={cellInfo.id}
      clicked={cellInfo.clicked}
      cellClick={cellClick}
      winner={winner}
      winningCells={winningCells}
      disabled={gameOver}
    />
  ))

  return (
    <div className="boardBody">
      <TurnIndicator
        turn={Xturn}
        win={win}
        draw={draw}
        winner={winner}
        gameOver={gameOver}
      />
      <div className="board">{boxes}</div>
      <div>
        {gameStatus && <RstButton restart={restart} gameOver={gameOver} />}
        <ExitBtn exit={exit} />
      </div>
      {win && <Confetti />}
    </div>
  )
}

export default App
