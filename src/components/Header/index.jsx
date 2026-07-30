import { Link, useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🎮 游戏中心
        </Link>
        <nav className="nav">
          <Link to="/">首页</Link>
          <Link to="/snake">贪吃蛇</Link>
          <Link to="/minesweeper">扫雷</Link>
          <Link to="/bomb">数字炸弹</Link>
        </nav>
        <div className="user-info">
          <span>👤 {user?.username || '用户'}</span>
          <button onClick={handleLogout} className="logout-btn">
            退出
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
