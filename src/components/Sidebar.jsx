import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const menuItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/galgame', label: 'Galgame', icon: '📖' }
  ]

  return (
    <div style={{
      width: collapsed ? '60px' : '200px',
      minHeight: '100vh',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '15px',
          textAlign: collapsed ? 'center' : 'right'
        }}
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* 菜单项 */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px' }}>
        {menuItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 10px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? '#fff' : '#ccc',
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                transition: 'all 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start'
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
