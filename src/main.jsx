import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'  // CSS-переменные темы — подключаются первыми
import './index.css'  // базовые стили каркаса
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
