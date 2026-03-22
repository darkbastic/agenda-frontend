import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Pruebas from './pages/Pruebas'
import Controles from './pages/Controles'
import Terrenos from './pages/Terrenos'
import Calendario from './pages/Calendario'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/controles" element={<Controles />} />
          <Route path="/pruebas" element={<Pruebas />} />
          <Route path="/terrenos" element={<Terrenos />} />
          <Route path="/calendario" element={<Calendario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
