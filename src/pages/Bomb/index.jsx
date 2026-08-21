import { useState, useEffect } from 'react'

function Bomb() {
  // 游戏状态
  const [minRange, setMinRange] = useState(1)
  const [maxRange, setMaxRange] = useState(100)
  const [bombNumber, setBombNumber] = useState(null)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // 开始新游戏
  const startNewGame = () => {
    const newBomb = Math.floor(Math.random() * 100) + 1
    setBombNumber(newBomb)
    setMinRange(1)
    setMaxRange(100)
    setGuess('')
    setMessage('💣 炸弹已藏好！猜一个 1-100 之间的数字')
    setHistory([])
    setGameOver(false)
    setAttempts(0)
  }

  // 猜数字
  const handleGuess = () => {
    const num = Number(guess)
    
    // 验证输入
    if (isNaN(num) || num < minRange || num > maxRange) {
      setMessage(`⚠️ 请输入 ${minRange}-${maxRange} 之间的数字！`)
      return
    }

    setAttempts(prev => prev + 1)
    
    // 检查是否猜中炸弹
    if (num === bombNumber) {
      setMessage(`💥 轰！炸弹爆炸了！数字 ${bombNumber} 就是炸弹！`)
      setGameOver(true)
      setHistory(prev => [...prev, { guess: num, result: '💥 炸弹！' }])
      return
    }
    
    // 缩小范围
    let hint = ''
    if (num < bombNumber) {
      setMinRange(num + 1)
      hint = '⬆️ 小了'
    } else {
      setMaxRange(num - 1)
      hint = '⬇️ 大了'
    }
    
    setMessage(`📌 范围缩小到 ${minRange}-${maxRange}`)
    setHistory(prev => [...prev, { guess: num, result: hint }])
    setGuess('')
  }

  // 键盘事件
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !gameOver) {
        handleGuess()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [guess, gameOver])

  // 初始化游戏
  useEffect(() => {
    startNewGame()
  }, [])

  return (
    <div className="game-page">
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
      <h1>💣 数字炸弹</h1>
      
      <div className="bomb-info">
        <div className="bomb-range">
          🔢 范围：{minRange} - {maxRange}
        </div>
        <div className="bomb-attempts">
          📝 尝试次数：{attempts}
        </div>
      </div>

      <div className="bomb-message">
        <p className={gameOver ? 'game-over-text' : ''}>
          {message}
        </p>
      </div>

      {!gameOver ? (
        <div className="bomb-input-area">
          <input
            type="number"
            className="bomb-input"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={`${minRange}-${maxRange}`}
            min={minRange}
            max={maxRange}
            disabled={gameOver}
          />
          <button 
            className="bomb-guess-btn"
            onClick={handleGuess}
            disabled={gameOver}
          >
            🎯 猜！
          </button>
        </div>
      ) : (
        <div className="bomb-game-over">
          <button className="bomb-new-game-btn" onClick={startNewGame}>
            🔄 重新开始
          </button>
        </div>
      )}

      <div className="bomb-history">
        <h3>📜 猜测历史</h3>
        {history.length === 0 && <p className="bomb-empty">还没有猜测记录</p>}
        <div className="bomb-history-list">
          {history.map((item, index) => (
            <div key={index} className="bomb-history-item">
              <span className="bomb-history-number">第 {index + 1} 次</span>
              <span className="bomb-history-guess">{item.guess}</span>
              <span className={`bomb-history-result ${item.result.includes('💥') ? 'bomb-hit' : ''}`}>
                {item.result}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="game-instructions">
        <p>🎯 在范围内猜数字，直到找到炸弹</p>
        <p>💡 每次猜测会缩小范围</p>
        <p>⌨️ 按 Enter 快速提交</p>
      </div>
    </div>
  )
}

export default Bomb