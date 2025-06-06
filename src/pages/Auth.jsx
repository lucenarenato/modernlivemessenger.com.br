import './styles.css'
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

import Login from "../components/authentication/Login";
import Register from "../components/authentication/Register";
import ResetPassword from "../components/authentication/ResetPassword";

export default function Auth() {
    const { t } = useTranslation('home');

    var whatToShow = "login";

    const [showLogin, setShowLogin] = useState(whatToShow === "login");
    const [showRegister, setShowRegister] = useState(whatToShow === "register");
    const [showResetPassword, setShowResetPassword] = useState(whatToShow === "reset");

    function showRegisterComponent() {
        setShowLogin(false);
        setShowRegister(true);
    };

    function showLoginComponent() {
        setShowRegister(false);
        setShowLogin(true);
    };

    function showReset() {
        setShowLogin(false);
        setShowResetPassword(true);
    };

    function hideReset() {
        setShowResetPassword(false);
        setShowLogin(true);
    };

    return (
        <div>


            {
                showLogin && (
                    <>
                        <Login />

                        <button onClick={showReset} className="flex justify-left w-32 mt-2 text-gray-500 dark:text-neutral-400 text-xs hover:underline">
                            <p>{t('login.forgot')}</p>
                        </button>

                        <div className="flex mt-4 text-sm w-full flex-row items-center justify-center text-gray-400 dark:text-neutral-400 gap-2">
                            <p>{t('login.change')}</p>
                            <button onClick={showRegisterComponent} className="text-primary font-bold hover:text-rose-700">{t('register.button')}</button>
                        </div>
                    </>
                )
            }

            {
                showRegister && (
                    <>
                        <Register />

                        <div className="flex mt-4 text-sm w-full flex-row items-center justify-center text-gray-400 dark:text-neutral-400 gap-2">
                            <p>{t('register.change')}</p>
                            <button onClick={showLoginComponent} className="text-primary font-bold hover:text-rose-700">{t('login.button')}</button>
                        </div>


                    </>
                )
            }

            {
                showResetPassword && (
                    <>
                        <ResetPassword />

                        <div className="flex mt-4 text-sm w-full flex-row items-center justify-center text-gray-400 dark:text-neutral-400 gap-2">
                            <p>{t('email.change')}</p>
                            <button onClick={hideReset} className="text-primary font-bold hover:text-rose-700">{t('login.button')}</button>
                        </div>
                    </>
                )
            }

        </div>
    )
};