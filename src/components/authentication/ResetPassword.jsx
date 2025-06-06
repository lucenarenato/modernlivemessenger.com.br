import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaCode } from "react-icons/fa6";

function generateRandomCode() {
    let code = "";
    const possibleDigits = "0123456789";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * 10);
        const randomDigit = possibleDigits[randomIndex];
        code += randomDigit;
    }
    return code;
};


export default function ResetPassword() {
    const { t } = useTranslation("auth");

    const [isLoading, setIsLoading] = useState(false);

    const [emailEnteredByUser, setEmailEnteredByUser] = useState("");

    // Código que será enviado para o email e código que será inserido no input pelo usuário:
    const [code, setCode] = useState(false);
    const [showEnterCodeBox, setEnterCodeBox] = useState(false);
    const [codeEnteredByUser, setCodeEnteredByUser] = useState("");
    //

    // Caixa de alteração de senha:
    const [showNewPasswordBox, setNewPasswordBox] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    //

    const handleSubmitEmailEnteredByUser = (e) => {
        e.preventDefault();

        //setIsLoading(true)

        var randomCode = generateRandomCode();
        setCode(randomCode);
        console.log(randomCode);

        setEnterCodeBox(true);

    }
    //

    // Na caixa para inserir o código enviado ao email:
    const handleCheckResetCode = (e) => {
        e.preventDefault()
        if (code === codeEnteredByUser) {
            setCode(false);
            setCodeEnteredByUser("");
            setEnterCodeBox(false);
            setNewPasswordBox(true);
        }
    };
    //

    // Checar a nova senha e fazer uma requisição de alteração:
    const handleCheckNewPassword = (e) => {
        e.preventDefault();

    };
    //

    const cancelReset = () => {
        setCode(false);
        setCodeEnteredByUser("");
        setNewPassword("");
        setUserEmailEnteredByUser("");
        setNewPasswordBox(false);
    }


    return (
        <div className="flex flex-col justify-center items-center">
            <p className="text-primary text-xl font-bold mt-1">Acumulou</p>

            {(showEnterCodeBox && showNewPasswordBox == false) ? (
                <form className="w-full">
                    <div className="flex justify-center">
                        <p className="dark:text-neutral-200 mb-4 text-md font-medium mt-5">{t('email.enter-code-title')}</p>
                    </div>

                    <div className="h-12 w-full border bg-gray-200 dark:bg-neutral-800 border-none rounded flex items-center mb-3">
                        <FaCode style={{ marginLeft: "5px" }} className="text-gray-400 dark:text-neutral-100 text-lg" />
                        <input
                            placeholder={t('inputs.code')}
                            type="text"
                            className="flex-1 dark:text-neutral-200 bg-gray-200 dark:bg-neutral-800 min-w-40% px-4 border-none outline-none"
                            value={codeEnteredByUser}
                            onChange={(e) => setCodeEnteredByUser(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-row justify-between w-full gap-2">
                        <button
                            className="border-none h-10 w-1/2 bg-green-600 hover:bg-green-700 rounded-md text-white cursor-pointer font-medium hover:bg-blue-700"
                            onClick={handleCheckResetCode}
                        >
                            {t('email.confirm')}
                        </button>

                        <button className="border-none h-10 w-1/2 bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 hover:bg-red-600 rounded-md text-white cursor-pointer font-medium"
                            onClick={cancelReset}
                        >
                            {t('email.cancel')}
                        </button>

                    </div>
                </form>

            ) : (code == false && showNewPasswordBox == true) ? (
                <form className="w-full">
                    <div className="flex justify-center">
                        <p className="dark:text-neutral-200 mb-4 text-md font-medium mt-5">{t('email.enter-new-password')}</p>
                    </div>

                    <div className="h-12 w-full border bg-gray-200 dark:bg-neutral-800 border-none rounded flex items-center mb-3">
                        <RiLockPasswordLine style={{ marginLeft: "5px" }} className="text-gray-400 dark:text-neutral-100 text-lg" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t('email.button')}
                            className="flex-1 dark:text-neutral-200  min-w-40% px-2 bg-gray-200 dark:bg-neutral-800 border-none outline-none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        {showPassword ? (

                            <VisibilityOffIcon className="text-gray-400 hover:text-gray-500 dark:text-neutral-600 dark:hover:text-neutral-500"
                                style={{ marginRight: "10px", marginLeft: "10px", fontSize: "1.2em", cursor: "pointer" }}
                                onClick={() => setShowPassword(false)}
                            />

                        ) : (

                            <VisibilityIcon className="text-gray-400 hover:text-gray-500 dark:text-neutral-600 dark:hover:text-neutral-500"
                                style={{ marginRight: "10px", marginLeft: "10px", fontSize: "1.2em", cursor: "pointer" }}
                                onClick={() => setShowPassword(true)}
                            />

                        )}
                    </div>

                    <div className="flex flex-row justify-between w-full gap-2">
                        <button
                            className="border-none h-10 w-full bg-primary rounded-md text-white cursor-pointer font-medium"
                            onClick={cancelReset}
                        >
                            {t('email.button')}
                        </button>
                    </div>
                </form>

            ) : (
                <form className="w-full">
                    <div className="flex justify-center">
                        <p className="dark:text-neutral-200 mb-4 text-md font-medium mt-5">{t('email.title')}</p>
                    </div>

                    <div className="h-12 w-full border dark:text-neutral-200 bg-gray-200 dark:bg-neutral-800 border-none rounded flex items-center mb-3">
                        <MdOutlineAlternateEmail style={{ marginLeft: "5px" }} className="text-gray-400 dark:text-neutral-100 text-lg" />
                        <input
                            placeholder={t('inputs.email')}
                            type="text"
                            className="flex-1 dark:text-neutral-200  bg-gray-200 dark:bg-neutral-800 px-2 border-none outline-none w-full"
                            value={emailEnteredByUser}
                            onChange={(e) => setEmailEnteredByUser(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full h-12 justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSubmitEmailEnteredByUser || code}
                    >
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress size={20} style={{ fontSize: "2px" }} color="secondary" />
                            </Box>
                        ) : (
                            <p>{t('email.button')}</p>
                        )}
                    </button>
                </form>
            )}

        </div>
    )
}