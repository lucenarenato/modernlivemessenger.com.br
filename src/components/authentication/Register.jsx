import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import { registerRequest } from "../../data/authentication";
import { useAuth } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";

export default function Register() {
    const { t } = useTranslation("auth");
    const { onLogout } = useAuth();
    const { showToast } = useContext(ToastContext);

    const [isLoading, setIsLoading] = useState(false);
    const [usernameEnteredByUser, setUsernameEnteredByUser] = useState("");
    const [emailEnteredByUser, setEmailEnteredByUser] = useState("");
    const [passwordEnteredByUser, setPasswordEnteredByUser] = useState("");
    const [showPasswordTyped, setShowPasswordTyped] = useState(false);
    const [passwordScore, setPasswordScore] = useState(0);
    const [errors, setErrors] = useState({}); // Estado para erros

    const checkPassword = () => {
        let score = 0;
        if (passwordEnteredByUser.length >= 6) {
            score++;
        }
        if (/[a-z]/.test(passwordEnteredByUser)) {
            score++;
        }
        if (/[A-Z]/.test(passwordEnteredByUser)) {
            score++;
        }
        if (/[^a-zA-Z0-9]/.test(passwordEnteredByUser)) {
            score++;
        }
        if (/[0-9]/.test(passwordEnteredByUser)) {
            score++;
        }
        setPasswordScore(score);
    };

    useEffect(() => {
        checkPassword()
    }, [passwordEnteredByUser]);

    const handleSubmitFormToRegister = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({}); // Limpa erros ao iniciar o registro

        // Validação de campos
        const validationErrors = {};
        if (!usernameEnteredByUser) validationErrors.username = "Username is required";
        if (!emailEnteredByUser) validationErrors.email = "Email is required";
        if (!passwordEnteredByUser) validationErrors.password = "Password is required";

        // Verifica se há erros
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        onLogout();

        registerRequest({
            email: emailEnteredByUser,
            password: passwordEnteredByUser,
            language: localStorage.getItem("i18nextLng")
        })
            .then(res => {
                if (res.status === 200) {
                    showToast("Criado com sucesso!", "success");
                } else if (res.response.status === 409) {
                    showToast(res.response.data.message, "error");
                    if (res.response.data.details[0].domain === "username") {
                        console.log("username já existe");
                    } else {
                        console.log("email já existe");
                    }
                }
                setIsLoading(false);
            })
            .catch(err => {
                showToast("An error occurred during registration.", "error");
                setIsLoading(false);
            });
    }

    return (
        <form className="flex flex-col justify-center items-center" onSubmit={handleSubmitFormToRegister}>
            <p className="text-primary text-xl font-bold mt-1">Acumulou</p>
            <p className="dark:text-white mb-4 text-md font-medium mt-5">{t('register.title')}</p>

            {/* Campo de Email */}
            <div className="flex w-full ml-1 justify-start">
                <label className="justify-left text-sm font-medium text-red-600">
                    {errors.email}
                </label>
            </div>
            <div className={`h-12 w-full border ${errors.email ? 'border-red-500' : 'border-none'} bg-gray-200 dark:bg-neutral-800 rounded flex items-center mb-4`}>
                <MdOutlineAlternateEmail style={{ marginLeft: "5px" }} className="text-gray-400 dark:text-neutral-100 text-lg" />
                <input
                    id="input-email"
                    placeholder={t('inputs.email')}
                    type="text"
                    className="flex-1 dark:text-neutral-100 bg-gray-200 dark:bg-neutral-800 min-w-40% px-2 border-none outline-none"
                    value={emailEnteredByUser}
                    onChange={(e) => setEmailEnteredByUser(e.target.value)}
                />
            </div>

            {/* Campo de Senha */}
            <div className="flex w-full ml-1 justify-start">
                <label className="justify-left text-sm font-medium text-red-600">
                    {errors.password}
                </label>
            </div>
            <div className={`h-12 w-full border ${errors.password ? 'border-red-500' : 'border-none'} bg-gray-200 dark:bg-neutral-800 rounded flex items-center`}>
                <RiLockPasswordLine style={{ marginLeft: "5px" }} className="text-gray-400 dark:text-neutral-100 text-lg" />
                <input
                    id="input-password"
                    type={showPasswordTyped ? "text" : "password"}
                    placeholder={t('inputs.password')}
                    className="flex-1 bg-gray-200 dark:bg-neutral-800 min-w-40% px-2 border-none outline-none"
                    value={passwordEnteredByUser}
                    onChange={(e) => setPasswordEnteredByUser(e.target.value)}
                />
                {showPasswordTyped ? (
                    <div className="text-gray-400 hover:text-gray-500 dark:text-neutral-600 dark:hover:text-neutral-500">
                        <VisibilityOffIcon
                            style={{ marginRight: "10px", marginLeft: "10px", fontSize: "1.2em", cursor: "pointer" }}
                            onClick={() => setShowPasswordTyped(false)}
                        />
                    </div>
                ) : (
                    <div className="text-gray-400 hover:text-gray-500 dark:text-neutral-600 dark:hover:text-neutral-500">
                        <VisibilityIcon
                            style={{ marginRight: "10px", marginLeft: "10px", fontSize: "1.2em", cursor: "pointer" }}
                            onClick={() => setShowPasswordTyped(true)}
                        />
                    </div>
                )}
            </div>

            {/* Indicador de Força da Senha */}
            <div className="flex w-full py-2 gap-2">
                {[...Array(5)].map((_, i) => (
                    <div className="w-full" key={i}>
                        <div className={`p-1 rounded-sm ${i < passwordScore ? passwordScore <= 2 ? 'bg-red-900' : passwordScore <= 4 ? 'bg-yellow-400' : 'bg-green-600' : 'bg-gray-200 dark:bg-neutral-800'}`} />
                    </div>
                ))}
            </div>

            {/* Botão de Registro */}
            <button
                className="w-full h-12 border-none justify-center items-center rounded bg-primary text-white cursor-pointer"
                type="submit"
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={20} style={{ fontSize: "2px" }} color="secondary" />
                    </Box>
                ) : (
                    <p>{t('register.button')}</p>
                )}
            </button>
        </form>
    )
}
