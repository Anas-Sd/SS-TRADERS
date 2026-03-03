import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import About from './pages/About'
import Search from './pages/Search'
import { AuthProvider } from './lib/AuthContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="items" element={<Items />}>
              <Route path=":itemId" element={<ItemDetail />} />
            </Route>
            <Route path="search" element={<Search />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
