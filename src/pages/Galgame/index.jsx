import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Galgame() {
  const navigate = useNavigate()
  const [showLevels, setShowLevels] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      position: 'relative'
    }}>
      {/* 返回按钮 */}
      <div style={{ textAlign: 'left', width: '100%' }}>
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

      {/* 左上角黑色方框 */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        width: '250px',
        background: '#000',
        borderRadius: '10px',
        padding: '30px 20px',
        textAlign: 'center',
        border: '2px solid #333'
      }}>
        {!showLevels ? (
          <>
            <h1 style={{ color: '#fff', fontSize: '28px', margin: '0 0 20px 0' }}>
              伪人小
            </h1>
            <div
              onClick={() => setShowLevels(true)}
              style={{
                color: '#ccc',
                fontSize: '18px',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              攻克
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ color: '#fff', fontSize: '22px', marginBottom: '20px' }}>
              第一关
            </div>
            <button
              onClick={() => navigate('/galgame/level/1')}
              style={{
                width: '150px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              进入
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Galgame