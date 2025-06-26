import React, { createContext, useState, useContext, useEffect } from 'react';

import { AuthContext } from './AuthContext';
import { getFriendships } from '../data/friendships';
import { ToastContext } from './ToastContext';
import secureLocalStorage from 'react-secure-storage';
import { sendMessage } from '../data/messages';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user, logout } = useContext(AuthContext)
    const { showToast } = useContext(ToastContext);

    const [contacts, setContacts] = useState([
        {
            "id": 0,
            "bio": "I'm not simple, i'm a super AI",
            "isFavorite": true,
            "status": "online",
            "avatar": "robot",
            "banner": "daisy_hill",
            "username": "A simple AI <3",
            "email": "ai@ficticial.com",
            "chatId": 0
        }
    ]);
    const [selectedContact, setSelectedContact] = useState();
    const [showIndividualChat, setShowIndividualChat] = useState(false);
    const [showChatWithAI, setShowChatWithAI] = useState(false);

    useEffect(() => {
        if (user) {
            getContacts()
        }
    }, [user])


    function getContacts() {
        getFriendships()
            .then(response => {
                if (response.status == 200) {
                    const aiContact = {
                        "id": 0,
                        "bio": "I'm not simple, i'm a super AI",
                        "isFavorite": true,
                        "status": "online",
                        "avatar": "robot",
                        "banner": "daisy_hill",
                        "username": "A simple AI <3",
                        "email": "ai@ficticial.com",
                        "chatId": 0
                    };

                    const updatedContacts = [aiContact, ...response.data];
                    setContacts(updatedContacts);
                    return
                }
                if (response.status == 401 && response.statusText == "Unauthorized" && response.data.message === "Token inválido ou expirado") {
                    showToast("Sua sessão expirou, faça o login novamente.", "error");
                    logout()
                }
                else {
                    showToast("Algo ocorreu mal ao buscar seus amigos.", "error");
                }
            })
            .catch(err => {
                (err)
                showToast("An error occurred getting your friendships.", "error");
            });
    }

    function selectContact(id) {
        setSelectedContact(contacts.find(contact => contact.id === id))
        setShowIndividualChat(true);
    }


    function closeIndividualChat() {
        setShowIndividualChat(false);
    }

    const [messages, setMessages] = useState(() => {
        const stored = secureLocalStorage.getItem('chatMessages');
        return stored ? JSON.parse(stored) : {};
    });

    useEffect(() => {
        secureLocalStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    function addMessage(chatId, message) {
        sendMessage({
            "chatId": chatId,
            "content": message.content,
            "drawAttention": message.drawAttention,
            "winks": message.winks
        })
            .then(response => {
                console.log(response)
                if (response.status == 200 || response.status == 201) {
                    console.log("Message sended.")
                    return
                }
                else {
                    showToast("Algo ocorreu mal ao enviar a nova mensagem.", "error");
                }
            })
            .catch(err => {
                console.log(err)
                showToast("An error occurred sending a new message.", "error");
            });
        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), message]
        }));
    }

    return (
        <ChatContext.Provider value={{
            contacts,
            messages,
            addMessage,
            selectedContact,
            selectContact,
            showIndividualChat,
            setShowIndividualChat,
            closeIndividualChat,
            showChatWithAI,
            getContacts
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
