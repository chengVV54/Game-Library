import { useEffect, useState } from 'react'
import GameCard from '../../components/GameCard'

function Home() {
  const [games, setGames] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [recentScores, setRecentScores] = useState([])
  const [selectedGame, setSelectedGame] = useState('Snake')
  
  useEffect(() => {
    fetch('https://public-flint-throttle.ngrok-free.dev/api/games')
      .then(res => res.json())
      .then(data => {
        const gameList = data.games.map(game => {
          if (game.name === 'Snake') {
            return {
              icon: '🐍',
              title: '贪吃蛇',
              description: '经典贪吃蛇游戏，挑战你的反应速度！',
              path: '/snake',
              color: '#4fc3f7'
            }
          } else if (game.name === 'Minesweeper') {
            return {
              icon: '💣',
              title: '扫雷',
              description: '经典扫雷游戏，考验你的逻辑思维！',
              path: '/minesweeper',
              color: '#ff8a65'
            }
          } else if (game.name === 'Bomb') {
            return {
              icon: '💥',
              title: '数字炸弹',
              description: '猜数字游戏，小心踩到炸弹！',
              path: '/bomb',
              color: '#ff6b6b'
            }
          }
          return null
        }).filter(game => game !== null)
        
        setGames(gameList)
      })
      .catch(err => {
        console.error('获取游戏列表失败:', err)
        setGames([
          {
            icon: '🐍',
            title: '贪吃蛇',
            description: '经典贪吃蛇游戏，挑战你的反应速度！',
            path: '/snake',
            color: '#4fc3f7'
          },
          {
            icon: '💣',
            title: '扫雷',
            description: '经典扫雷游戏，考验你的逻辑思维！',
            path: '/minesweeper',
            color: '#ff8a65'
          },
          {
            icon: '💥',
            title: '数字炸弹',
            description: '猜数字游戏，小心踩到炸弹！',
            path: '/bomb',
            color: '#ff6b6b'
          }
        ])
      })
  }, [])

  // 获取排行榜和我的最近成绩
  useEffect(() => {
    fetch(`https://public-flint-throttle.ngrok-free.dev/api/leaderboard?game=${selectedGame}`)
      .then(res => res.json())
      .then(data => setLeaderboard(data.leaderboard))
      .catch(err => console.error('排行榜获取失败:', err))
    
    fetch(`https://public-flint-throttle.ngrok-free.dev/api/my-scores?username=xzcc&game=${selectedGame}`)
      .then(res => res.json())
      .then(data => setRecentScores(data.scores))
      .catch(err => console.error('最近成绩获取失败:', err))
  }, [selectedGame])

  return (
    <div className="home-page">
      <h1>🏠 游戏大厅</h1>
      <p className="welcome-text">欢迎来到游戏中心，选择你喜欢的游戏吧！</p>
      <div className="game-grid">
        {games.map((game, index) => (
          <GameCard key={index} {...game} />
        ))}
      </div>

      {/* ====== 游戏选择器 ====== */}
      <div style={{ marginTop: '40px' }}>
        <select 
          value={selectedGame} 
          onChange={(e) => setSelectedGame(e.target.value)}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}
        >
          <option value="Snake">贪吃蛇</option>
          <option value="Minesweeper">扫雷</option>
          <option value="Bomb">数字炸弹</option>
        </select>
      </div>

      {/* ====== 排行榜和最近成绩并排 ====== */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '76px',  // 约2cm
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        
        {/* 我的最近成绩 */}
        <div style={{ flex: '1', minWidth: '250px', maxWidth: '400px' }}>
          <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
            📊 我的最近成绩（{selectedGame === 'Snake' ? '贪吃蛇' : selectedGame === 'Minesweeper' ? '扫雷' : '数字炸弹'}）
          </h2>
          
          {recentScores.length === 0 ? (
            <p style={{ color: '#888' }}>暂无记录</p>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px' }}>分数</th>
                  <th style={{ padding: '10px' }}>时间</th>
                </tr>
              </thead>
              <tbody>
                {recentScores.map((score, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{score}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {new Date().toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 排行榜 */}
        <div style={{ flex: '1', minWidth: '250px', maxWidth: '400px' }}>
          <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>🏆 排行榜</h2>
          
          {leaderboard.length === 0 ? (
            <p style={{ color: '#888' }}>暂无成绩</p>
          ) : (
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px' }}>排名</th>
                  <th style={{ padding: '10px' }}>玩家</th>
                  <th style={{ padding: '10px' }}>最高分</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.rank} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{entry.username}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        
      </div>
    </div>
  )
}

export default Home