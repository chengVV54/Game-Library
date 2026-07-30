import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
      localStorage.setItem('user', JSON.stringify({ username }))
      navigate('/')
    } else {
      setError('用户名或密码错误！')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🔐 登录</h1>
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
          {error && <p className="error">{error}</p>}
          <button type="submit" className="auth-btn">登录</button>
        </form>
        <p className="auth-link">
          还没有账号？<Link to="/register">立即注册</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
