import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('两次密码输入不一致！')
      return
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    if (users.find(u => u.username === username)) {
      setError('用户名已存在！')
      return
    }
    
    users.push({ username, password })
    localStorage.setItem('users', JSON.stringify(users))
    
    localStorage.setItem('user', JSON.stringify({ username }))
    navigate('/')
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
          已有账号？<Link to="/login">去登录</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
