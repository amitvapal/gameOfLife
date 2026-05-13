import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Today from './screens/Today.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Goals from './screens/Goals.jsx';
import Fitness from './screens/Fitness.jsx';
import { AppStateProvider } from './hooks/useAppState.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Today />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="goals" element={<Goals />} />
            <Route path="fitness" element={<Fitness />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  </React.StrictMode>
);
