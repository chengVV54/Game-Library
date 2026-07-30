import { useState, useEffect } from 'react'

function Minesweeper() {
  const [grid, setGrid] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [mines, setMines] = useState(10)
  const [rows, setRows] = useState(9)
  const [cols, setCols] = useState(9)

  const initGame = () => {
    setGameOver(false)
    setGameWon(false)
    const newGrid = []
    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0
        })
      }
      newGrid.push(row)
    }
    let minesPlaced = 0
    while (minesPlaced < mines) {
      const r = Math.floor(Math.random() * rows)
      const c = Math.floor(Math.random() * cols)
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true
        minesPlaced++
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isMine) continue
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
              count++
            }
          }
        }
        newGrid[r][c].adjacentMines = count
      }
    }
    setGrid(newGrid)
  }

  const revealCell = (r, c) => {
    if (gameOver || gameWon) return
    if (grid[r][c].isFlagged) return
    if (grid[r][c].isRevealed) return

    const newGrid = [...grid]
    if (newGrid[r][c].isMine) {
      newGrid[r][c].isRevealed = true
      setGrid(newGrid)
      setGameOver(true)
      return
    }

    const reveal = (row, col) => {
      if (row < 0 || row >= rows || col < 0 || col >= cols) return
      if (newGrid[row][col].isRevealed) return
      if (newGrid[row][col].isFlagged) return
      if (newGrid[row][col].isMine) return

      newGrid[row][col].isRevealed = true

      if (newGrid[row][col].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(row + dr, col + dc)
          }
        }
      }
    }

    reveal(r, c)
    setGrid(newGrid)

    let revealed = 0
    for (let rr = 0; rr < rows; rr++) {
      for (let cc = 0; cc < cols; cc++) {
        if (newGrid[rr][cc].isRevealed) revealed++
      }
    }
    if (revealed === rows * cols - mines) {
      setGameWon(true)
    }
  }

  const toggleFlag = (e, r, c) => {
    e.preventDefault()
    if (gameOver || gameWon) return
    if (grid[r][c].isRevealed) return

    const newGrid = [...grid]
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged
    setGrid(newGrid)
  }

  useEffect(() => {
    initGame()
  }, [])

  const getCellDisplay = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) return '💣'
      if (cell.adjacentMines === 0) return ''
      return cell.adjacentMines
    }
    if (cell.isFlagged) return '🚩'
    return null
  }

  return (
    <div className="game-page">
      <h1>💣 扫雷</h1>
      <div className="game-info">
        <span>💣 地雷: {mines}</span>
        <button onClick={initGame}>🔄 新游戏</button>
      </div>
      {gameOver && <p className="game-over-text">💀 踩到地雷了！游戏结束</p>}
      {gameWon && <p className="game-won-text">🎉 恭喜你赢了！</p>}
      <div className="minesweeper-grid" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 40px)`,
        gridTemplateRows: `repeat(${rows}, 40px)`,
        gap: '2px',
        backgroundColor: '#333',
        padding: '4px',
        borderRadius: '4px'
      }}>
        {grid.map((row, r) => 
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`mine-cell ${cell.isRevealed ? 'revealed' : 'hidden'}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
            >
              {getCellDisplay(cell)}
            </div>
          ))
        )}
      </div>
      <div className="game-instructions">
        <p>🖱️ 左键揭开盘子 | 右键标记地雷</p>
      </div>
    </div>
  )
}

export default Minesweeper
