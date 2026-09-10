import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PortfolioPage } from './pages/PortfolioPage.tsx'
import { EditorDashboard } from './pages/editor/EditorDashboard.tsx'
import { EditorLogin } from './pages/editor/EditorLogin.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/editor/login" element={<EditorLogin />} />
        <Route path="/editor" element={<EditorDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
