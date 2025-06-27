import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
import Desktop from './pages/Desktop';

import { AuthContext, AuthProvider } from './context/AuthContext';
import { ChatContext } from './context/ChatContext';

function App() {
  const { connectOnSocket } = useContext(ChatContext);
  const { checkSession, logout } = useContext(AuthContext);

  useEffect(() => {

    const verifySession = async () => {
      const sessionValid = await checkSession();
      console.log("Sessão válida?", sessionValid);
      if (sessionValid) {
        connectOnSocket();
      }
    };

    verifySession();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route
              path="/chat"
              element={<Desktop />}
            />

            <Route path="*" element={<Navigate to="/chat" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
