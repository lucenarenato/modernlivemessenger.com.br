import './index.css';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react"

import { PortfolioThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from '@mui/system';
import { theme } from './theme/theme.js';

import './i18next.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Analytics />

    <ThemeProvider theme={theme}>
      <ToastProvider>
        <PortfolioThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PortfolioThemeProvider>
      </ToastProvider>
    </ThemeProvider>
  </>
)