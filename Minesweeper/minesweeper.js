import { TILE_STATUS, createBoard, flagTile, revealTile, checkWin, checkLose } from "./game.js"

const BOARD_HEIGHT = 8
const BOARD_WIDTH = 8
const NUMBER_OF_MINES = 4

const board = createBoard(BOARD_HEIGHT, BOARD_WIDTH, NUMBER_OF_MINES)
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
    tile.element.addEventListener('contextmenu', e=> {
      e.preventDefault()
      flagTile(tile)
      listMinesLeft()
    })
  })
))
boardElement.style.setProperty('--width', BOARD_WIDTH)
boardElement.style.setProperty('--height', BOARD_HEIGHT)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
  const flaggedCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUS.MARKED).length
  }, 0)

  minesLeftText.textContent = NUMBER_OF_MINES - flaggedCount 
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true })
    boardElement.addEventListener('contextmenu', stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = "You Win!"
  }
  if (lose) {
    messageText.textContent = "You Lose"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.TILE_STATUS === TILE_STATUS.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}