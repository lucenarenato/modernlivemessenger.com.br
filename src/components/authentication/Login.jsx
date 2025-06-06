import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import { ToastContext } from "../../context/ToastContext";
import { loginRequest } from "../../data/authentication";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
    const { t } = useTranslation("auth");

    const { login } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);

    const { handleSubmit, register, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordTyped, setShowPasswordTyped] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);

        loginRequest({
            email: data.email,
            password: data.password,
            language: localStorage.getItem("i18nextLng")
        })
            .then(response => {
                if (response.status == 200) {
                    login(response.data)
                    setIsLoading(false);
                    showToast("Autenticado com sucesso.", "success");
                    return
                }
                if (response.status == 400) {
                    showToast("Credenciais inválidas.", "error");
                    setIsLoading(false);
                }
                else {
                    showToast("Algo ocorreu mal no login.", "error");
                    setIsLoading(false);
                }
            })
            .catch(err => {
                showToast("An error occurred during login.", "error");
                setIsLoading(false);
            });
    };

    return (
        <form className="flex flex-col justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-primary text-xl font-bold mt-1">Acumulou</p>

            <p className="dark:text-white mb-4 text-md font-medium mt-5">{t('login.title')}</p>

            <div className={`h-12 w-full border bg-gray-200 dark:bg-neutral-800 ${errors.email ? 'border-red-500' : 'border-none'} rounded flex items-center mb-5`}>
                <MdOutlineAlternateEmail style={{ marginLeft: "5px" }} className={`text-lg ${errors.email ? 'text-red-400' : 'text-gray-400 dark:text-neutral-100'}`} />
                <input
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address"
                        }
                    })}
                    placeholder={t('inputs.email')}
                    type="text"
                    className="flex-1 dark:text-neutral-100 bg-gray-200 dark:bg-neutral-800 min-w-40% px-2 border-none outline-none"
                />
            </div>
            {errors.email &&
                <p className="-mt-5 mb-5 w-full text-red-500">
                    {errors.email.message}
                </p>
            }

            <div className={`h-12 w-full border bg-gray-200 dark:bg-neutral-800 ${errors.password ? 'border-red-500' : 'border-none'} rounded flex items-center mb-5`}>
                <RiLockPasswordLine style={{ marginLeft: "5px" }} className={`text-lg ${errors.password ? 'text-red-400' : 'text-gray-400 dark:text-neutral-100'}`} />
                <input
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                    type={showPasswordTyped ? "text" : "password"}
                    placeholder={t('inputs.password')}
                    className="flex-1 text-main-color min-w-40% px-2 bg-gray-200 dark:bg-neutral-800 border-none outline-none"
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
            {errors.password &&
                <p className="-mt-5 mb-5 w-full text-red-500">
                    {errors.password.message}
                </p>
            }

            <button
                className="w-full h-12 border-none justify-center items-center rounded bg-primary text-white cursor-pointer"
                type="submit"
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <CircularProgress size={20} color="white" />
                    </Box>
                ) : (
                    <p>{t('login.button')}</p>
                )}
            </button>
        </form>
    );
}
