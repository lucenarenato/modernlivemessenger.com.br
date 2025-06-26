import React, { createContext, useState, useContext, useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';

import { ToastContext } from './ToastContext';
import { useTranslation } from 'react-i18next';
import { checkToken } from '../data/authentication';
import { updateAvatarAndBanner, updateBio, updateStatus, updateUsername } from '../data/users';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation("auth");
  const { showToast } = useContext(ToastContext);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = secureLocalStorage.getItem('flm-user');
    const storedToken = secureLocalStorage.getItem('flm-token');

    if (storedToken && typeof storedToken === 'object' && storedToken.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(storedToken.expiresAt);

      if (now < expiresAt) {
        setUser(storedUser);
        setToken(storedToken.value);
      } else {
        secureLocalStorage.removeItem('flm-user');
        secureLocalStorage.removeItem('flm-token');

        showToast({
          type: 'warning',
          message: t('login.session-expired') || 'Sua sessão expirou. Faça login novamente.',
        });
      }
    } else {
      secureLocalStorage.removeItem('flm-user');
      secureLocalStorage.removeItem('flm-token');
    }
  }, []);

  function login(data, options) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // expira em 7 dias

    const tokenData = {
      value: data.access_token,
      expiresAt: expirationDate.toISOString(),
    };

    setUser(data.user);
    setToken(data.access_token);

    secureLocalStorage.setItem('flm-user', data.user);
    secureLocalStorage.setItem('flm-token', tokenData);
  }

  function logout() {
    setUser(null);
    setToken(null);

    secureLocalStorage.removeItem('flm-user');
    secureLocalStorage.removeItem('flm-tokens');

    showToast(t("toast.logout"), "success")

  }

  function checkSession() {
    const storedToken = secureLocalStorage.getItem('flm-token');
    if (!storedToken) return false;

    const now = new Date();
    const expiresAt = new Date(storedToken.expiresAt);
    if (now > expiresAt) {
      return false
    }

    checkToken()
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          return true
        }
        else return false
      })
      .catch(err => {
        return false
      })

    return true
  }

  function updateUserField(field, value, apiCall, toastKey) {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const previousValue = prevUser[field];
      const updatedUser = { ...prevUser, [field]: value };
      setUser(updatedUser);
      secureLocalStorage.setItem('flm-user', updatedUser);

      apiCall({ [field]: value })
        .then((res) => {
          if (res.status !== 200) {
            revertUser();
          }
        })
        .catch(() => {
          revertUser();
        });

      function revertUser() {
        const revertedUser = { ...updatedUser, [field]: previousValue };
        setUser(revertedUser);
        secureLocalStorage.setItem('flm-user', revertedUser);
        showToast(t(toastKey) || "Erro ao atualizar.", "error");
      }

      return updatedUser;
    });
  }

  function changeStatus(status) {
    updateUserField("status", status, updateStatus, "toast.error-updating-status");
  }

  function changeUsername(username) {
    updateUserField("username", username, updateUsername, "toast.error-updating-username");
  }

  function changeBio(bio) {
    updateUserField("bio", bio, updateBio, "toast.error-updating-bio");
  }

  function changeAvatar(avatar) {
    updateUserField("avatar", avatar, updateAvatarAndBanner, "toast.error-updating-avatar");
  }

  function changeBanner(banner) {
    updateUserField("banner", banner, updateAvatarAndBanner, "toast.error-updating-banner");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, checkSession, changeStatus, changeUsername, changeBio, changeAvatar, changeBanner }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
