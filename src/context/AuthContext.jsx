import React, { createContext, useState, useContext, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import secureLocalStorage from 'react-secure-storage';

import { ToastContext } from './ToastContext';
import { useTranslation } from 'react-i18next';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation("auth");
  const { showToast } = useContext(ToastContext);

  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const storedUser = secureLocalStorage.getItem('acumulou-user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  function login(data) {
    setUser(data.user);
    setTokens({
      "token": data.token,
      "refreshToken": data.refreshToken
    });

    secureLocalStorage.setItem('flm-user', user);
    secureLocalStorage.setItem('flm-tokens', tokens);
  }

  function logout() {
    setUser(null);
    setTokens(null);
    googleLogout();

    secureLocalStorage.removeItem('flm-user');
    secureLocalStorage.removeItem('flm-tokens');

    showToast(t("toast.logout"), "success")
  }

  function checkSession() {
    return true
  }

  const handleUser = () => {
    if (!user) {
      setShowAuthenticationModal(true);
      return;
    }
    setShowProfileModal(true);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkSession, handleUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
