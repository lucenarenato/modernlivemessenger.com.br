import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import * as Select from '@radix-ui/react-select';
import Avatar from '../Avatar';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { MdCheckCircleOutline } from 'react-icons/md';

export default function Auth() {
    const { t } = useTranslation("auth");

    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
            autoSignIn: false,
            status: "online",
        }
    });

    useEffect(() => {
        reset({
            email: "",
            password: "",
            rememberMe: false,
            autoSignIn: false,
            status: "online",
        });
    }, [t, reset]);

    const onSubmit = (data) => {
        console.log("Form data:", data);
    };

    return (
        <div className="w-full mx-auto bg-white overflow-hidden">
            <div className="h-32 bg-gradient-to-b from-sky-300 via-sky-200 to-white relative">
                <div className="absolute top-4 left-4">
                    <h1 className="text-gray-700 text-lg font-normal">{t('login.title')}</h1>
                    <h2 className="text-gray-800 text-xl font-normal">
                        {t('login.name-one')} <span className="font-bold">{t('login.name-two')}</span>
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-4 -mt-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex w-full sm:max-w-20 justify-center">
                        <Avatar size={82} />
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col">
                            <input
                                type="email"
                                placeholder={t('inputs.email')}
                                {...register("email", { required: true })}
                                className={`w-80 px-3 py-2 bg-gradient-to-b from-white to-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-400'} rounded-sm shadow-inner focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_0_0_2px_rgba(59,130,246,0.3)] text-gray-800 placeholder:text-gray-500 font-segoe`}
                            />
                            {errors.email && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                        </div>

                        <div className="flex flex-col">
                            <input
                                type="password"
                                placeholder={t('inputs.password')}
                                {...register("password", { required: true })}
                                className={`w-80 px-3 py-2 bg-gradient-to-b from-white to-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-400'} rounded-sm shadow-inner focus:outline-none focus:border-blue-500 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),0_0_0_2px_rgba(59,130,246,0.3)] text-gray-800 placeholder:text-gray-500 font-segoe`}
                            />
                            {errors.password && <p className="text-red-500 text-xs">Campo obrigatório</p>}
                        </div>

                        <div className="text-left">
                            <a href="#" className="text-blue-600 text-xs hover:underline">{t('login.forgot')}</a>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-700">{t('login.session')}</span>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => {
                                    const colorMap = {
                                        online: 'bg-green-500',
                                        away: 'bg-red-500',
                                        busy: 'bg-orange-400',
                                        invisible: 'bg-gray-400',
                                    };

                                    return (
                                        <Select.Root value={field.value} onValueChange={field.onChange}>
                                            <Select.Trigger
                                                className="px-1 py-1 rounded-md border border-gray-300 bg-white text-sm text-gray-800 flex items-center justify-between min-w-[120px]"
                                                style={{
                                                    all: 'unset',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    backgroundColor: 'white',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <Select.Value asChild>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-2.5 h-2.5 rounded-sm ${colorMap[field.value]} border-2 border-gray-300`} />
                                                        <span>{t(`status.${field.value}`)}</span>
                                                    </div>
                                                </Select.Value>
                                                <Select.Icon>
                                                    <FaChevronDown className="text-gray-400" />
                                                </Select.Icon>
                                            </Select.Trigger>

                                            <Select.Portal>
                                                <Select.Content className="ml-4 bg-white shadow-md">
                                                    <Select.Viewport>
                                                        {['online', 'away', 'busy', 'invisible'].map((value) => (
                                                            <Select.Item
                                                                key={value}
                                                                value={value}
                                                                className="text-sm px-2 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-1.5 cursor-pointer"
                                                            >
                                                                <span className={`w-2.5 h-2.5 rounded-sm ${colorMap[value]} border-2 border-gray-300`} />
                                                                <Select.ItemText>{t(`status.${value}`)}</Select.ItemText>
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Viewport>
                                                </Select.Content>
                                            </Select.Portal>
                                        </Select.Root>
                                    );
                                }}
                            />

                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-2">
                            <div className="field-row">
                                <input type="checkbox" id="reminder" {...register("rememberMe")} />
                                <label htmlFor="reminder">{t('login.record')}</label>
                            </div>
                            <div className="field-row">
                                <input type="checkbox" id="session" {...register("autoSignIn")} />
                                <label htmlFor="session">{t('login.enter')}</label>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6 justify-left">
                            <button type="submit" className="default">{t('login.button-enter')}</button>
                            <button type="button">{t('login.button-cancel')}</button>
                        </div>

                        <div className="text-left mt-4">
                            <span className="text-xs text-gray-600">{t('login.register-title')} </span>
                            <a href="#" className="text-blue-600 text-xs hover:underline">{t('login.register-button')}</a>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    );
}
