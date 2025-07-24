import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import secureLocalStorage from 'react-secure-storage';

import sounds from '../imports/sounds';

import { AuthContext } from './AuthContext';
import { ToastContext } from './ToastContext';

import { getFriendships, getPendingFriendshipsInvites } from '../data/friendships';
import { getAllMessages, getMessagesByChat, sendMessage } from '../data/messages';
import { winks } from '../imports/winks';
import { useTranslation } from 'react-i18next';

const SOCKET_BASE_URL = import.meta.env.VITE_WEBSOCKET_URL;

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user, logout } = useContext(AuthContext)
    const { showCustomToast } = useContext(ToastContext);
    const { t } = useTranslation("toast")


    const [contacts, setContacts] = useState([
        {
            "id": 0,
            "ai": true,
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
    const [selectedContact, setSelectedContact] = useState(null);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const [showIndividualChat, setShowIndividualChat] = useState(false);
    const [showChatWithAI, setShowChatWithAI] = useState(false);

    const contactsRef = useRef(contacts);

    const selectedContactRef = useRef(selectedContact);

    useEffect(() => {
        contactsRef.current = contacts;
    }, [contacts]);

    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);

    useEffect(() => {
        if (user) {
            getContacts()
            getMessages()
        }
    }, [user])

    function logoutChat() {
        disconnectFromSocket();
        logout(true);
    }

    function fetchPendingInvites() {
        getPendingFriendshipsInvites()
            .then((response) => {
                if (response.status === 200) {
                    setPendingInvites(response.data || []);
                }
            })
            .catch((err) => {
                console.error(err);
                showCustomToast("Error", t('error.pending-invites'))
            });
    }

    function getContacts() {
        getFriendships()
            .then(response => {
                if (response.status == 200) {
                    const aiContact = {
                        "id": 0,
                        "ai": true,
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
                    showCustomToast("Error", t("error.session-expired"));
                    logout()
                }
                else {
                    showCustomToast("Error", t("error.friendships"));
                }
            })
            .catch(err => {
                (err)
                showCustomToast("Error", t("error.friendships"));
            });
    }

    function selectContact(id) {
        const contact = contactsRef.current.find(c => c.id === id);
        setSelectedContact(contact);
        selectedContactRef.current = contact;
        setShowIndividualChat(true);
    }

    function closeIndividualChat() {
        setSelectedContact(null);
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
                showCustomToast("Error", t("error.message"));
            }
        } catch (err) {
            console.error(err);
            showCustomToast("Error", t("error.message"));
        }
    }


    async function addMessageWithAI(chatId, message) {
        setMessages(prev => {
            const updated = {
                ...prev,
                [chatId]: [...(prev[chatId] || []), message]
            };
            return updated;
        });
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
                showCustomToast("Error", t('error.messages'));
            }
        } catch (err) {
            console.error(err);
            showCustomToast("Error", t('error.messages'));
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
                console.log(event)

                switch (type) {
                    case "message":
                        receiveMessage(payload.chatId, payload);
                        break;
                    case "friend_request":
                        receiveFriendRequest(payload);
                        break;
                    case "friend_response":
                        receiveFriendResponse(payload);
                        break;
                    case "user_status_update":
                        updateContactStatus(payload);
                        break;
                    case "user_bio_update":
                        updateContactBio(payload)
                        break;
                    case "user_username_update":
                        updateContactUsername(payload)
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
            console.log("🧨 WebSocket encerrado.");
            setConnection(null);
        }
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }
    }

    const [shaking, setShaking] = useState(false);
    const ruffleRef = useRef(null);

    function showWink(alias) {
        const wink = winks[alias];
        if (ruffleRef.current && wink) {
            ruffleRef.current.play(wink.path, wink.duration);
        }
    }

    function sendWink(alias, chatId) {
        const wink = winks[alias];
        if (ruffleRef.current && wink) {
            ruffleRef.current.play(wink.path, wink.duration);
        }

        const newMessage = {
            senderId: user.id,
            content: alias,
            drawAttention: false,
            winks: true,
        };

        if (!selectContact.ai) {
            addMessage(chatId, newMessage)
        } else {
            addMessageWithAI(chatId, newMessage)
        }
    }

    function receiveNudge(message) {
        if (selectedContactRef.current?.id === message.senderId) {
            setShaking(true);
            const audio = new Audio(sounds.nudge);
            audio.play();
            setTimeout(() => {
                setShaking(false);
            }, 500);
        } else {
            const sender = contactsRef.current.find(c => c.id == message.senderId)
            showCustomToast(
                t('nudge.title'),                        // title
                t('nudge.text'),                         // text
                true,                                    // nudge
                sender?.avatar,                          // avatar
                sender?.id,                              // id
                false,                                   // wink
                false,                                   // isMessage
                () => { },                               // onWink
                () => selectContact(sender?.id),         // onOpenChat
                t('nudge.open')                          // translation
            )
        }
    };

    function receiveWink(message) {
        if (selectedContactRef.current?.id === message.senderId) {
            const wink = winks[message.content];
            if (ruffleRef.current && wink) {
                ruffleRef.current.play(wink.path, wink.duration);
            }
        } else {
            const sender = contactsRef.current.find(c => c.id == message.senderId)
            showCustomToast(
                t('wink.title'),                         // title
                t('wink..text'),                         // text
                false,                                   // nudge
                sender?.avatar,                          // avatar
                sender?.id,                              // id
                message.content,                         // wink
                false,                                   // isMessage
                () => showWink(message.content),         // onWink
                () => { },                               // onOpenChat
                t('wink.open')                           // translation
            )
        }
    };

    // Adiciona nova mensagem recebida de outro usuário
    const receiveMessage = useCallback((chatId, message) => {
        const newMessage = {
            id: message.id,
            senderId: message.senderId,
            chatId: chatId,
            content: message.content,
            drawAttention: message.drawAttention,
            winks: message.winks
        }

        if (message.drawAttention) {
            receiveNudge(message)
        } else if (message.winks) {
            receiveWink(message)
        }

        console.log("💬 Mensagem recebida:", message)
        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMessage],
        }));

        if ((message.senderId !== selectedContactRef.current?.id) && (!message.drawAttention && !message.winks)) {

            const sender = contactsRef.current.find(c => c.id == message.senderId)

            if (!sender) {
                console.warn("🚨 Contato não encontrado para senderId:", message.senderId);
                return;
            }

            const audio = new Audio(sounds.newmessage);
            setTimeout(() => {
                audio.play();
            }, 100);

            showCustomToast(
                t('message.title'),                      // title
                t('message.text'),                       // text
                false,                                   // nudge
                sender?.avatar,                          // avatar
                sender?.id,                              // id
                null,                                    // wink
                true,                                    // isMessage
                () => { },                               // onWink
                () => selectContact(sender?.id),         // onOpenChat
                t('message.open')                        // translation
            )
        }
    }, [contacts, selectedContact]);

    // Receber um pedido de amizade
    function receiveFriendRequest(payload) {
        showCustomToast(t('friendship.title'), t('friendship.text'));
        fetchPendingInvites()
    }

    // Um amigo aceitou um pedido
    function receiveFriendResponse(payload) {
        showCustomToast(t('friendship.accepted-title'), t('friendship.accepted-text'));
        getContacts();
    }

    // Atualiza status
    function updateContactStatus(payload) {
        setContacts(prevContacts => {
            return prevContacts.map(contact => {
                if (contact.id === payload.id) {
                    const wasOffline = contact.status === "offline";
                    const isNowOnline = payload.status !== "offline";

                    // Se estava offline e agora está em outro status
                    if (wasOffline && isNowOnline) {
                        const audio = new Audio(sounds.online);
                        setTimeout(() => {
                            audio.play();
                        }, 100);

                        showCustomToast(
                            t('status.title'),                            // Exemplo: "Disponível"
                            t('status.text', { name: contact.username }), // Exemplo: "Seu amigo {{name}} está disponível!"
                            false,                      // nudge
                            contact.avatar,             // avatar
                            contact.id,                 // id
                            null,                       // wink
                            true,                      // isMessage
                            () => { },                   // onWink
                            () => selectContact(contact.id), // onOpenChat
                            t('status.open')            // tradução do botão
                        );
                    }

                    return { ...contact, status: payload.status };
                }
                return contact;
            });
        });

    }

    // Atualiza bio
    function updateContactBio(payload) {
        setContacts(prevContacts =>
            prevContacts.map(contact =>
                contact.id === payload.id
                    ? { ...contact, bio: payload.bio }
                    : contact
            )
        );
    }

    // Atualiza username
    function updateContactUsername(payload) {
        setContacts(prevContacts =>
            prevContacts.map(contact =>
                contact.id === payload.id
                    ? { ...contact, username: payload.username }
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
            shaking,
            setShaking,
            sendWink,
            showWink,
            ruffleRef,
            addMessage,
            addMessageWithAI,
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
            connection,
            logoutChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
