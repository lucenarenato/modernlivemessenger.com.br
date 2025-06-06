import React, { createContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket';
import { showErrorMessage, showSuccessMessage } from "../utils/showNotification";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isLoadingSocket, setIsLoadingSocket] = useState(false);

    const handleConnectionSocket = () => {
        setIsLoadingSocket(true);

        if (!socket.connected) {
            socket.connect();
            socket.on('connect_error', onError);
        } else {
            setIsLoadingSocket(false);
            showSuccessMessage("Socket já está conectado!");
        }
    };

    const onError = (error) => {
        showErrorMessage(`Erro ao conectar ao servidor de socket! Olhe o console para mais informações.`);
        console.log(error);
    };

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
            setIsLoadingSocket(false);
        };

        const onDisconnect = () => {
            setIsConnected(false);
            setIsLoadingSocket(false);
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ isConnected, isLoadingSocket, handleConnectionSocket, socket }}>
            {children}
        </SocketContext.Provider>
    );
};