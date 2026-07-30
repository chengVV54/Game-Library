import { Link } from 'react-router-dom'

function GameCard({ icon, title, description, path, color }) {
  return (
    <Link to={path} className="game-card">
      <div className="game-card-icon" style={{ background: color }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="play-btn">开始游戏 →</button>
    </Link>
  )
}

export default GameCard
