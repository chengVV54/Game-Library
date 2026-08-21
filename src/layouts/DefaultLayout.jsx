import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import { useLocation } from 'react-router-dom'

// 背景图导入不变...
import homeBg from '../assets/home-bg.jpg'
import snakeBg from '../assets/snake-bg.jpg'
import minesweeperBg from '../assets/minesweeper-bg.jpg'
import bombBg from '../assets/bomb-bg.jpg'
import galgameBg from '../assets/galgame-bg.jpg'  // 如果没有这图，暂时用homeBg

function DefaultLayout({ children }) {
  const location = useLocation()
  
  const getBackground = () => {
    const path = location.pathname
    if (path === '/') return homeBg
    if (path === '/snake') return snakeBg
    if (path === '/minesweeper') return minesweeperBg
    if (path === '/bomb') return bombBg
    if (path === '/galgame') return galgameBg  // 没有图的话改成 homeBg
    return homeBg
  }

  return (
    <div style={{
      backgroundImage: `url(${getBackground()})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      display: 'flex'
    }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '60px', transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default DefaultLayout