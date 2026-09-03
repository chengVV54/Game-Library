import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      })
      
      const data = await response.json()
      
      if (data.status === 'ok') {
        navigate('/login')
      } else {
        setError(data.message || '注册失败')
      }
    } catch(err) {
      setError('无法连接服务器')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>📝 注册</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="auth-btn">注册</button>
        </form>
        <p className="auth-link">
          已有账号？<Link to="/login">立即登录</Link>
        </p>
      </div>
    </div>
  )
}

export default Register