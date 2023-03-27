import { start } from "./timer.js"

export const TILE_STATUS = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked'
}

export function createBoard(numRows, numCols, numMines) {
  const board = []
  const minePositions = getMinePositions(numRows, numCols, numMines)

  for (let x = 0; x < numRows; x++) {
    const row = []
    for (let y = 0; y < numCols; y++) {
      const element = document.createElement('div')
      element.dataset.status = TILE_STATUS.HIDDEN

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(p => positionMatch(p, { x, y })),
        get status() {
          return this.element.dataset.status
        },
        set status(newStatus) {
          this.element.dataset.status = newStatus
        }
      }

      row.push(tile)
    }
    board.push(row)
  }
  return board
}

export function flagTile(tile) {
  if (
    tile.status !== TILE_STATUS.HIDDEN && 
    tile.status !== TILE_STATUS.MARKED
  ) {
    return
  }

  if (tile.status === TILE_STATUS.MARKED) {
    tile.status = TILE_STATUS.HIDDEN
  } else {
    tile.status = TILE_STATUS.MARKED
  }
}

export function revealTile(board, tile) {
  start()

  if (tile.status !== TILE_STATUS.HIDDEN) {
    return
  }

  if (tile.mine) {
    tile.status = TILE_STATUS.MINE
    return
  }

  tile.status = TILE_STATUS.NUMBER
  const adjTiles = nearbyTiles(board, tile)
  const adjMines = adjTiles.filter(t => t.mine)
  if (adjMines.length === 0) {
    adjTiles.forEach(t => revealTile(board, t))
  } else {
    tile.element.textContent = adjMines.length
  }
}

export function checkWin(board) {
  return board.every(row => {
    return row.every(tile => {
      return tile.status === TILE_STATUS.NUMBER ||
        (tile.mine && (tile.status === TILE_STATUS.HIDDEN ||
          tile.status === TILE_STATUS.MARKED))
    })
  })
}

export function checkLose(board) {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUS.MINE
    })
  })
}

function getMinePositions(numRows, numCols, numMines) {
  const positions = []

  while (positions.length < numMines) {
    const position = {
      x: randomNumber(numRows),
      y: randomNumber(numCols)
    }

    if (!positions.some(p => positionMatch(p, position))) {
      positions.push(position);
    }
  }

  return positions
}

function positionMatch(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

function randomNumber(size) {
  return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)
    }
  }

  return tiles
}