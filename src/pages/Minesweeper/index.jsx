import { useState, useEffect, useRef } from 'react'

function Minesweeper() {
  const [difficulty, setDifficulty] = useState('easy')
  const [grid, setGrid] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [mines, setMines] = useState(10)
  const [rows, setRows] = useState(10)
  const [cols, setCols] = useState(10)
  const [time, setTime] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef(null)

  const difficulties = {
    easy: { rows: 10, cols: 10, mines: 10 },
    normal: { rows: 15, cols: 25, mines: 50 },
    hard: { rows: 20, cols: 40, mines: 120 }
  }

  const changeDifficulty = (level) => {
    setDifficulty(level)
    const config = difficulties[level]
    setRows(config.rows)
    setCols(config.cols)
    setMines(config.mines)
    stopTimer()
    setTime(0)
    initGameWithConfig(config.rows, config.cols, config.mines)
  }

  const initGameWithConfig = (rCount, cCount, mineCount) => {
    setGameOver(false)
    setGameWon(false)
    const newGrid = []
    for (let r = 0; r < rCount; r++) {
      const row = []
      for (let c = 0; c < cCount; c++) {
        row.push({
          isMine: false,
          isRevealed: false,
          state: 0,
          adjacentMines: 0
        })
      }
      newGrid.push(row)
    }
    let minesPlaced = 0
    while (minesPlaced < mineCount) {
      const r = Math.floor(Math.random() * rCount)
      const c = Math.floor(Math.random() * cCount)
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true
        minesPlaced++
      }
    }
    for (let r = 0; r < rCount; r++) {
      for (let c = 0; c < cCount; c++) {
        if (newGrid[r][c].isMine) continue
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < rCount && nc >= 0 && nc < cCount && newGrid[nr][nc].isMine) {
              count++
            }
          }
        }
        newGrid[r][c].adjacentMines = count
      }
    }
    setGrid(newGrid)
  }

  const startTimer = () => {
    if (timerRunning) return
    setTimerRunning(true)
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    setTimerRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const initGame = () => {
    stopTimer()
    setTime(0)
    initGameWithConfig(rows, cols, mines)
  }

  const submitScore = (finalTime) => {
    fetch('https://public-flint-throttle.ngrok-free.dev/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=xzcc&game=Minesweeper&score=${finalTime}`
    })
      .then(res => res.json())
      .then(data => console.log('✅ 扫雷成绩已提交，用时:', finalTime, '秒，最佳:', data.best))
      .catch(err => console.error('❌ 提交失败:', err))
  }

  const revealCell = (r, c) => {
    if (gameOver || gameWon) return
    if (grid[r][c].state === 1) return
    if (grid[r][c].isRevealed) return

    if (!timerRunning) {
      startTimer()
    }

    const newGrid = [...grid.map(row => [...row])]
    if (newGrid[r][c].isMine) {
      newGrid[r][c].isRevealed = true
      
      // 显示所有地雷
      for (let rr = 0; rr < rows; rr++) {
        for (let cc = 0; cc < cols; cc++) {
          if (newGrid[rr][cc].isMine) {
            newGrid[rr][cc].isRevealed = true
          }
        }
      }
      
      setGrid(newGrid)
      setGameOver(true)
      stopTimer()
      return
    }

    const reveal = (row, col) => {
      if (row < 0 || row >= rows || col < 0 || col >= cols) return
      if (newGrid[row][col].isRevealed) return
      if (newGrid[row][col].state === 1) return
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
      stopTimer()
      submitScore(time)
    }
  }

  const cycleCellState = (e, r, c) => {
    e.preventDefault()
    if (gameOver || gameWon) return
    if (grid[r][c].isRevealed) return

    const newGrid = [...grid.map(row => [...row])]
    newGrid[r][c].state = (newGrid[r][c].state + 1) % 3
    setGrid(newGrid)
  }

  useEffect(() => {
    initGame()
    return () => stopTimer()
  }, [])

  const getCellDisplay = (cell) => {
    if (cell.isRevealed) {
      if (cell.isMine) return '💣'
      if (cell.adjacentMines === 0) return ''
      return cell.adjacentMines
    }
    if (cell.state === 1) return '🚩'
    if (cell.state === 2) return '❓'
    return ''
  }

  const CELL_SIZE = '35px'

  return (
    <div className="game-page" >
      <div style={{ textAlign: 'left', width: '100%', marginLeft: '5mm', marginTop: '5mm' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(100, 180, 255, 0.8)',
            color: '#fff',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
  >
    ← 返回
  </button>
</div>
      
      <h1>💣 扫雷</h1>
      
      {/* 难度选择 */}
      <div className="difficulty-selector" style={{ marginBottom: '15px' }}>
        <button onClick={() => changeDifficulty('easy')} style={{
          margin: '0 5px', padding: '8px 16px',
          background: difficulty === 'easy' ? '#4fc3f7' : 'transparent',
          border: '1px solid #4fc3f7', color: difficulty === 'easy' ? '#fff' : '#4fc3f7',
          borderRadius: '6px', cursor: 'pointer'
        }}>简单 10×10</button>
        
        <button onClick={() => changeDifficulty('normal')} style={{
          margin: '0 5px', padding: '8px 16px',
          background: difficulty === 'normal' ? '#ffa726' : 'transparent',
          border: '1px solid #ffa726', color: difficulty === 'normal' ? '#fff' : '#ffa726',
          borderRadius: '6px', cursor: 'pointer'
        }}>普通 15×25</button>
        
        <button onClick={() => changeDifficulty('hard')} style={{
          margin: '0 5px', padding: '8px 16px',
          background: difficulty === 'hard' ? '#ff6b6b' : 'transparent',
          border: '1px solid #ff6b6b', color: difficulty === 'hard' ? '#fff' : '#ff6b6b',
          borderRadius: '6px', cursor: 'pointer'
        }}>困难 20×40</button>
      </div>

      <div className="game-info" style={{ marginBottom: '10px' }}>
        <span style={{ margin: '0 10px' }}>💣 地雷: {mines}</span>
        <span style={{ margin: '0 10px' }}>⏱️ 用时: {time}秒</span>
        <button onClick={initGame}>🔄 新游戏</button>
      </div>

      {gameOver && <p className="game-over-text">💀 踩到地雷了！游戏结束</p>}
      {gameWon && <p className="game-won-text">🎉 恭喜你赢了！用时 {time} 秒</p>}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <div className="minesweeper-grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE})`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE})`,
          gap: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: '4px'
        }}>
          {grid.map((row, r) => 
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`mine-cell ${cell.isRevealed ? 'revealed' : 'hidden'}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => cycleCellState(e, r, c)}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  background: cell.isRevealed 
                    ? (cell.isMine ? '#d280d2' : '#b0b0b8') 
                    : '#4a4a5a',
                  borderRadius: '3px',
                  color: cell.isRevealed ? '#333' : '#fff'
                }}
              >
                {getCellDisplay(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="game-instructions" style={{ marginTop: '15px' }}>
        <p>🖱️ 左键点开 | 右键：🚩标旗 → ❓问号 → 恢复</p>
        <p>⏱️ 通关用时越短，排名越高</p>
      </div>
    </div>
  )
}

export default Minesweeper
