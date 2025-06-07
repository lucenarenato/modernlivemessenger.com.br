import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import Auth from './pages/Auth';
import Chat from './pages/Chat';

import { AuthContext, AuthProvider } from './context/AuthContext';

function App() {
  const { user, checkSession, logout } = useContext(AuthContext);

  useEffect(() => {
    const session = checkSession();
    if (!session) {
      logout();
    }
  }, [user]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route
              path="/chat"
              element={<Chat />}
            />

            <Route path="*" element={<Navigate to="/chat" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
