//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import App from './screens/ttcustDataGrid.tsx'
import {Login} from './screens/login.tsx'
import Home from './screens/home.tsx'
import DrawerContainer from './screens/drawerContainer.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/data/:id" element={<App />} />
          <Route path="/home/:id" element={<Home />} />
        </Routes>
    </BrowserRouter>
)
