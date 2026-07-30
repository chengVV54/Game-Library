import { createBrowserRouter } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Snake from './pages/Snake'
import Minesweeper from './pages/Minesweeper'
import Bomb from './pages/Bomb'

const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DefaultLayout>
          <Home />
        </DefaultLayout>
      </PrivateRoute>
    )
  },
  {
    path: '/snake',
    element: (
      <PrivateRoute>
        <DefaultLayout>
          <Snake />
        </DefaultLayout>
      </PrivateRoute>
    )
  },
  {
    path: '/minesweeper',
    element: (
      <PrivateRoute>
        <DefaultLayout>
          <Minesweeper />
        </DefaultLayout>
      </PrivateRoute>
    )
  },
  {
    path: '/bomb',
    element: (
      <PrivateRoute>
        <DefaultLayout>
          <Bomb />
        </DefaultLayout>
      </PrivateRoute>
    )
  }
]

export default routes
