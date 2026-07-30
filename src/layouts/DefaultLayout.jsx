import Header from '../components/Header'
import Footer from '../components/Footer'

function DefaultLayout({ children }) {
  return (
    <div className="default-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default DefaultLayout
