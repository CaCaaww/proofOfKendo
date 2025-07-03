//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './screens/ttcustDataGrid.tsx'
import {Login} from './screens/login.tsx'
import Home from './screens/home.tsx'
import IauDataGrid from './screens/iauDataGrid.tsx';

createRoot(document.getElementById('root')!).render(
      <BrowserRouter basename="/your-app" >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/data/:id" element={<App />} />
            <Route path="/home/:id" element={<Home />} />
            <Route path="/iauData/:id" element={<IauDataGrid/> } />
          </Routes>
      </BrowserRouter>
)
