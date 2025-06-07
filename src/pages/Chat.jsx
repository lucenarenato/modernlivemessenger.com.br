import './styles.css'
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import Desktop from '../layout/Desktop';

export default function Chat() {
    const { t } = useTranslation('home');

    return (
        <Desktop />
    )
};