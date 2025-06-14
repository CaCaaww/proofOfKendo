import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './screens/ttcustDataGrid.tsx'
import {Login} from './screens/login.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/data/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
)
