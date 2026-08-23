import { useState, useEffect, useCallback, useRef } from 'react'

function Snake() {
  const [snake, setSnake] = useState([
    [10, 10],
    [9, 10],
    [8, 10]
  ])
  const [food, setFood] = useState([15, 10])
  const [direction, setDirection] = useState('right')
  const [nextDirection, setNextDirection] = useState('right')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(200)
  const gameLoopRef = useRef(null)
  const GRID_SIZE = 20

  const generateFood = useCallback(() => {
    let newFood
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ]
    } while (snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]))
    setFood(newFood)
  }, [snake])

  const startGame = () => {
    if (isPlaying) return
    setIsPlaying(true)
    setGameOver(false)
    setSnake([
      [10, 10],
      [9, 10],
      [8, 10]
    ])
    setDirection('right')
    setNextDirection('right')
    setScore(0)
    setSpeed(200)
    generateFood()
  }

  const resetGame = () => {
    setIsPlaying(false)
    setGameOver(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
    setSnake([
      [10, 10],
      [9, 10],
      [8, 10]
    ])
    setScore(0)
    generateFood()
  }

  const endGame = () => {
    setGameOver(true)
    setIsPlaying(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
    
    // ====== 提交成绩到后端 ======
    fetch('https://public-flint-throttle.ngrok-free.dev/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=xzcc&game=Snake&score=${score}`
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ 成绩已提交，最高分:', data.best)
      })
      .catch(err => console.error('❌ 提交失败:', err))
  }

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return

    setDirection(nextDirection)
    const head = snake[0]
    let newHead = [...head]

    switch (nextDirection) {
      case 'up': newHead = [head[0] - 1, head[1]]; break
      case 'down': newHead = [head[0] + 1, head[1]]; break
      case 'left': newHead = [head[0], head[1] - 1]; break
      case 'right': newHead = [head[0], head[1] + 1]; break
      default: return
    }

    if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
      endGame()
      return
    }

    const isEating = newHead[0] === food[0] && newHead[1] === food[1]
    let newSnake = [newHead, ...snake]
    if (!isEating) newSnake.pop()

    const headCollision = newSnake.slice(1).some(
      segment => segment[0] === newHead[0] && segment[1] === newHead[1]
    )
    if (headCollision) {
      endGame()
      return
    }

    setSnake(newSnake)
    if (isEating) {
      setScore(prev => prev + 10)
      if ((score + 10) % 50 === 0) {
        setSpeed(prev => Math.max(prev - 20, 80))
      }
      generateFood()
    }
  }, [snake, food, nextDirection, gameOver, isPlaying, score, generateFood])

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key
      e.preventDefault()
      if (!isPlaying && !gameOver) { startGame(); return }

      const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' }
      let newDir = null
      switch (key) {
        case 'ArrowUp': case 'w': case 'W': newDir = 'up'; break
        case 'ArrowDown': case 's': case 'S': newDir = 'down'; break
        case 'ArrowLeft': case 'a': case 'A': newDir = 'left'; break
        case 'ArrowRight': case 'd': case 'D': newDir = 'right'; break
        default: return
      }
      if (newDir && opposite[newDir] !== direction) {
        setNextDirection(newDir)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, gameOver, direction, startGame])

  useEffect(() => {
    if (isPlaying && !gameOver) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      gameLoopRef.current = setInterval(moveSnake, speed)
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [isPlaying, gameOver, speed, moveSnake])

  useEffect(() => {
    generateFood()
  }, [])

  const renderGrid = () => {
    const grid = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isSnake = snake.some(segment => segment[0] === row && segment[1] === col)
        const isHead = snake.length > 0 && snake[0][0] === row && snake[0][1] === col
        const isFood = food[0] === row && food[1] === col

        let className = 'cell'
        if (isSnake) className += ' snake'
        if (isHead) className += ' head'
        if (isFood) className += ' food'

        grid.push(<div key={`${row}-${col}`} className={className} />)
      }
    }
    return grid
  }

  return (
    <div className="game-page">
      {/* 第一个返回按钮：有实际功能（点击后返回上一页） */}
      <div style={{ textAlign: 'left', marginBottom: '10px' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'transparent',
            border: '1px solid #58a6ff',
            color: '#58a6ff',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← 返回
        </button>
      </div>

      {/* 第二个返回按钮：无实际操作，仅作为展示 */}
      <div style={{ textAlign: 'left', marginBottom: '10px' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(100, 180, 255, 0.8)',
            color: '#fff',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '5mm',
            marginTop: '5mm'
          }}
        >
          ← 返回
        </button>
      </div>

      <h1>🐍 贪吃蛇</h1>
      <div className="game-info">
        <span>🏆 分数: {score}</span>
        <span>📏 长度: {snake.length}</span>
      </div>
      <div className="game-grid-container">
        <div className="game-grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
          gap: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          padding: '2px',
          borderRadius: '4px'
        }}>
          {renderGrid()}
        </div>
      </div>
      <div className="game-controls">
        {!isPlaying && !gameOver && (
          <button onClick={startGame}>▶️ 开始游戏</button>
        )}
        {gameOver && (
          <div>
            <p className="game-over-text">💀 游戏结束！得分: {score}</p>
            <button onClick={resetGame}>🔄 重新开始</button>
          </div>
        )}
        {isPlaying && (
          <button onClick={resetGame}>⏹️ 结束游戏</button>
        )}
      </div>
      <div className="game-instructions">
        <p>🎮 方向键 / WASD 控制方向</p>
      </div>
    </div>
  )
}

export default Snake
