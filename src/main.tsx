//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css'
import { TtcustDataGrid} from './screens/ttcustDataGrid.tsx'
import {Login} from './screens/login.tsx'
import { Home } from './screens/home.tsx'
import { IauDataGrid } from './screens/iauDataGrid.tsx';


//this renders the whole project
createRoot(document.getElementById('root')!).render(
      // the browser router allows us to path to different screens by updating the url. the basename is the the first part of the url that identifies
      // that it is using this app. It will go infront of the other url endings like so (for the data page): http://localhost:8040/your-app/data/IMS
      // The colon after the / in the router declarations tells the router that whatever is after that slash should be a variable (that can be accessed in the code)
      <BrowserRouter basename="/your-app" >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/data/:id" element={<TtcustDataGrid />} />
            <Route path="/home/:id" element={<Home />} />
            <Route path="/iauData/:id" element={<IauDataGrid/> } />
          </Routes>
      </BrowserRouter>
)


