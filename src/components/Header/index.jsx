import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header style={{
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(5px)',
      padding: '8px 20px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <span style={{ color: '#fff' }}>👤 {user?.username || '用户'}</span>
        <button 
          onClick={handleLogout}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          退出
        </button>
      </div>
    </header>
  )
}

export default Header