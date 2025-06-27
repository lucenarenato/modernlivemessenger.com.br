import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';

import secureLocalStorage from 'react-secure-storage';
import { AuthContext } from './AuthContext';
import { getFriendships, getPendingFriendshipsInvites } from '../data/friendships';
import { ToastContext } from './ToastContext';
import { getAllMessages, getMessages, getMessagesByChat, sendMessage } from '../data/messages';

const SOCKET_BASE_URL = import.meta.env.VITE_WEBSOCKET_URL;

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
    const [pendingInvites, setPendingInvites] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const [showIndividualChat, setShowIndividualChat] = useState(false);
    const [showChatWithAI, setShowChatWithAI] = useState(false);

    useEffect(() => {
        if (user) {
            getContacts()
        }
    }, [user])

    function fetchPendingInvites() {
        getPendingFriendshipsInvites()
            .then((response) => {
                if (response.status === 200) {
                    setPendingInvites(response.data || []);
                }
            })
            .catch((err) => {
                console.error(err);
                showToast("Não foi possível buscar pedidos pendentes.", "error");
            });
    }

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
    const [unreadCounts, setUnreadCounts] = useState({});

    useEffect(() => {
        secureLocalStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    async function addMessage(chatId, message) {
        try {
            const response = await sendMessage({
                chatId: chatId,
                content: message.content,
                drawAttention: message.drawAttention,
                winks: message.winks
            });

            if (response.status === 200 || response.status === 201) {
                const newMessage = response.data;
                setMessages(prev => ({
                    ...prev,
                    [chatId]: [...(prev[chatId] || []), newMessage]
                }));
            } else {
                showToast("Algo ocorreu mal ao enviar a nova mensagem.", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erro ao enviar a mensagem.", "error");
        }
    }

    function getMessagesByChat(chat_id) {
        getMessagesByChat(chat_id)
    }

    async function getMessages() {
        try {
            const response = await getAllMessages();
            if (response.status === 200) {
                const data = response.data;

                if (data.chats) {
                    setMessages(data.chats);
                }

                if (data.unreadCounts) {
                    setUnreadCounts(data.unreadCounts);
                }

            } else {
                showToast("Erro ao buscar mensagens", "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Erro ao buscar mensagens", "error");
        }
    }

    // Socket
    const [connection, setConnection] = useState(null);
    const reconnectAttempts = useRef(0);
    const reconnectTimeout = useRef(null);

    function connectOnSocket() {
        const storedToken = secureLocalStorage.getItem('flm-token');
        if (!storedToken || !storedToken.value) {
            console.warn("⚠️ Token não encontrado para WebSocket.");
            return;
        }

        const socket = new WebSocket(`${SOCKET_BASE_URL}ws?token=${storedToken.value}`);

        socket.onopen = () => {
            console.log("✅ WebSocket conectado.");
            setConnection(socket);
            reconnectAttempts.current = 0;
        };

        socket.onmessage = (event) => {
            try {
                const { type, payload } = JSON.parse(event.data);

                switch (type) {
                    case "message":
                        receiveMessage(payload.chatId, payload.message);
                        break;
                    case "friend_request":
                        receiveFriendRequest(payload);
                        break;
                    case "friend_response":
                        receiveFriendResponse(payload);
                        break;
                    case "user_status_update":
                    case "user_bio_update":
                    case "user_username_update":
                        receiveUserUpdate(type, payload);
                        break;
                    default:
                        console.warn("🌀 Evento WebSocket desconhecido:", type);
                }
            } catch (err) {
                console.error("❌ Erro ao processar WebSocket:", err);
            }
        };

        socket.onclose = (event) => {
            setConnection(null);
            if (event.wasClean) {
                console.log(`🔌 Conexão encerrada: code=${event.code}, reason=${event.reason}`);
            } else {
                console.error("💥 Conexão perdida. Tentando reconectar...");
                attemptReconnect();
            }
        };

        socket.onerror = (err) => {
            console.error("🌐 Erro no WebSocket:", err);
            socket.close();
        };

    };

    const attemptReconnect = useCallback(() => {
        if (reconnectAttempts.current >= 5) {
            console.error("⚠️ Maximum reconnection attempts reached.");
            return;
        }

        const delay = Math.min(5000, 1000 * (reconnectAttempts.current + 1)); // Exponential backoff capped at 5s
        reconnectAttempts.current += 1;

        console.log(`🔄 Attempting to reconnect in ${delay / 1000}s...`);

        reconnectTimeout.current = setTimeout(() => {
            connectOnSocket();
        }, delay);
    }, [connectOnSocket]);

    function disconnectFromSocket() {
        if (connection) {
            connection.close();
            setConnection(null);
        }
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }
        console.log("🔌 WebSocket manually disconnected.");
    }

    // Adiciona nova mensagem recebida de outro usuário
    function receiveMessage(chatId, message) {
        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), message],
        }));
    }

    // Adiciona um novo pedido de amizade
    function receiveFriendRequest(payload) {
        showToast("📩 Novo pedido de amizade!", "info");
        getContacts(); // Atualiza a lista de contatos
    }

    // Responde a um pedido de amizade
    function receiveFriendResponse(payload) {
        showToast("✅ Um amigo aceitou seu pedido de amizade!", "success");
        getContacts(); // Atualiza a lista de contatos
    }

    // Atualiza status, bio ou username de um contato específico
    function receiveUserUpdate(type, payload) {
        const field = type.replace("user_", "").replace("_update", ""); // status, bio ou username
        setContacts(prev =>
            prev.map(contact =>
                contact.id === payload.userId
                    ? { ...contact, [field]: payload[field] }
                    : contact
            )
        );
    }

    return (
        <ChatContext.Provider value={{
            contacts,
            pendingInvites,
            setPendingInvites,
            loadingId,
            setLoadingId,
            fetchPendingInvites,
            messages,
            addMessage,
            getMessagesByChat,
            getMessages,
            selectedContact,
            selectContact,
            showIndividualChat,
            setShowIndividualChat,
            closeIndividualChat,
            showChatWithAI,
            getContacts,
            connectOnSocket,
            disconnectFromSocket,
            connection
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
