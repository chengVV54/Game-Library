import GameCard from '../../components/GameCard'

function Home() {
  const games = [
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
  ]

  return (
    <div className="home-page">
      <h1>🏠 游戏大厅</h1>
      <p className="welcome-text">欢迎来到游戏中心，选择你喜欢的游戏吧！</p>
      <div className="game-grid">
        {games.map((game, index) => (
          <GameCard key={index} {...game} />
        ))}
      </div>
    </div>
  )
}

export default Home
