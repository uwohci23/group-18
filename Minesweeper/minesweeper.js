import { TILE_STATUS, createBoard, flagTile, revealTile, checkWin, checkLose } from "./game.js"
import { stop, getTime, formatTime} from "./timer.js"
import { openGameOverModal } from '../UI/endmenu.js';
import { saveHighScore, isFastScore} from "../UI/highscores.js";

//Event listener for submitting high score
document.getElementById('submit-button').addEventListener('click', () => {
  const score = document.querySelector("#final-score").textContent;
  const name = document.querySelector("#player-name").value;
  saveHighScore("Minesweeper", difficulty, getTime(), name);
  document.querySelector("#submit-button").style.display = "none";
});

// Retrieving difficulty and adjusting board parameters
const difficulty = localStorage.getItem('ms-difficulty')
var boardHeight, boardWidth, numMines
switch (difficulty) {
  case 'easy':
    boardHeight = 10
    boardWidth = 10
    numMines = 10
    break
  case 'medium':
    boardHeight = 14
    boardWidth = 18
    numMines = 40
    break
  case 'hard':
    boardHeight = 20
    boardWidth = 24
    numMines = 99
    break
  default:
    boardHeight = 8
    boardWidth = 8
    numMines = 4
    break
}

const board = createBoard(boardHeight, boardWidth, numMines)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

board.forEach(row => (
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener('click', () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener('contextmenu', e => {
      e.preventDefault()
      flagTile(tile)
      listMinesLeft()
    })
  })
))
boardElement.style.setProperty('--width', boardWidth)
boardElement.style.setProperty('--height', boardHeight)
minesLeftText.textContent = numMines

function listMinesLeft() {
  const flaggedCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUS.MARKED).length
  }, 0)

  minesLeftText.textContent = numMines - flaggedCount 
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win) {
    messageText.textContent = "You Win!"
  }
  else if (lose) {
    document.querySelector(".game-over-modal label").style.display = "none";
    document.querySelector(".game-over-modal input").style.display = "none";
    document.querySelector("#submit-button").style.display = "none";
    messageText.textContent = "You Lose"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.TILE_STATUS === TILE_STATUS.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true })
    boardElement.addEventListener('contextmenu', stopProp, { capture: true })
    stop()
    //If not a high score hide high score form
    console.log(isFastScore(getTime(), "Minesweeper", difficulty));
    if(!isFastScore(getTime(), "Minesweeper", difficulty)){
      document.querySelector(".game-over-modal label").style.display = "none";
      document.querySelector(".game-over-modal input").style.display = "none";
      document.querySelector("#submit-button").style.display = "none";
    }
    openGameOverModal(formatTime(getTime()));
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}