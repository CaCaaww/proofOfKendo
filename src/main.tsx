import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './screens/ttcustDataGrid.tsx'
import {Login} from './screens/login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Login/>
  </StrictMode>,
)
