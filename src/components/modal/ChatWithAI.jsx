import React, { useState, useContext, useEffect, useRef } from 'react';
import '7.css/dist/7.scoped.css';

import Footer from '../Footer';

import { useParams } from 'react-router-dom';
import axios from 'axios';

import EmoticonSelector from '../selectors/EmoticonSelector';
import WinkSelector from '../selectors/WinkSelector';

import EmoticonContext from '../../context/EmoticonContext';
import { ChatContext } from '../../context/ChatContext';

import Background from '../chat/Background';
import AvatarLarge from '../AvatarLarge';

import { replaceEmoticons } from '../../helpers/replaceEmoticons';
import { getOpenAIResponse } from '../../utils/openai';
import { useWindowManager } from '../../context/WindowManagerContext';
import { AuthContext } from '../../context/AuthContext';

export default function ChatWithAI({ windowId = 'chat', close }) {
    const { closeIndividualChat } = useContext(ChatContext);
    const { topWindowId, setTopWindowId } = useWindowManager();

    const bringToFront = () => {
        setTopWindowId(windowId);
    };

    const isTop = topWindowId === windowId;
    const zIndex = isTop ? 100 : 10;

    useEffect(() => {
        const win = windowRef.current;
        if (!win) return;

        win.addEventListener('mousedown', bringToFront);
        return () => win.removeEventListener('mousedown', bringToFront);
    }, []);

    const containerRef = useRef(null);
    const windowRef = useRef(null);
    const isDragging = useRef(false);
    const coords = useRef({ startX: 0, startY: 0, lastX: 0, lastY: 0 });

    useEffect(() => {
        const container = containerRef.current;
        const win = windowRef.current;
        if (!container || !win) return;

        const onMouseDown = (e) => {
            if (!e.target.closest('.title-bar')) return;
            isDragging.current = true;
            coords.current.startX = e.clientX;
            coords.current.startY = e.clientY;
            coords.current.lastX = win.offsetLeft;
            coords.current.lastY = win.offsetTop;
        };

        const onMouseUp = () => {
            isDragging.current = false;
        };

        const onMouseMove = (e) => {
            if (!isDragging.current) return;
            const deltaX = e.clientX - coords.current.startX;
            const deltaY = e.clientY - coords.current.startY;
            win.style.left = `${coords.current.lastX + deltaX}px`;
            win.style.top = `${coords.current.lastY + deltaY}px`;
        };

        const onTouchStart = (e) => {
            if (!e.target.closest('.title-bar')) return;
            isDragging.current = true;
            const touch = e.touches[0];
            coords.current.startX = touch.clientX;
            coords.current.startY = touch.clientY;
            coords.current.lastX = win.offsetLeft;
            coords.current.lastY = win.offsetTop;
        };

        const onTouchMove = (e) => {
            if (!isDragging.current) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - coords.current.startX;
            const deltaY = touch.clientY - coords.current.startY;
            win.style.left = `${coords.current.lastX + deltaX}px`;
            win.style.top = `${coords.current.lastY + deltaY}px`;
        };

        const onTouchEnd = () => {
            isDragging.current = false;
        };

        win.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mouseleave', onMouseUp);

        win.addEventListener('touchstart', onTouchStart);
        container.addEventListener('touchmove', onTouchMove);
        container.addEventListener('touchend', onTouchEnd);
        container.addEventListener('touchcancel', onTouchEnd);

        return () => {
            win.removeEventListener('mousedown', onMouseDown);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mouseleave', onMouseUp);

            win.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
            container.removeEventListener('touchend', onTouchEnd);
            container.removeEventListener('touchcancel', onTouchEnd);
        };
    }, []);

    const { contacts, selectedContact } = useContext(ChatContext);
    const { user } = useContext(AuthContext);

    const { id } = useParams();
    const [shaking, setShaking] = useState(false);
    const [input, setInput] = useState('');
    const [lastMessageTime, setLastMessageTime] = useState(null);
    const [contactTyping, setContactTyping] = useState(false);
    const userEmail = localStorage.getItem('email');
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const { selectedEmoticon, setSelectedEmoticon } = useContext(EmoticonContext);

    const [messages, setMessages] = useState(() => {
        if (id) {
            const savedMessages = localStorage.getItem(`chatMessages_${id}`);
            return savedMessages ? JSON.parse(savedMessages) : [];
        }
        return [];
    });

    useEffect(() => {
        if (selectedEmoticon) {
            setInput((prevInput) => prevInput + selectedEmoticon);
            setSelectedEmoticon(null);
        }
    }, [selectedEmoticon, setSelectedEmoticon]);

    useEffect(() => {
        if (id) {
            localStorage.setItem(`chatMessages_${id}`, JSON.stringify(messages));
        }
    }, [messages, id]);

    const scrollToBottom = () => {
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage = { role: 'user', content: input };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setInput('');
        simulateContactTyping();

        setTimeout(() => {
            if (newMessage.content !== 'You have just sent a nudge.') {
                getAssistantResponse(newMessages);
            }
        }, 1000);

        scrollToBottom();
    };

    const getAssistantResponse = async (newMessages) => {
        const assistantMessage = await getOpenAIResponse(newMessages, apiKey);
        const botMessage = { role: 'assistant', content: assistantMessage };
        setMessages([...newMessages, botMessage]);
    };

    const contact = contacts.find((c) => c.id === parseInt(id, 10));

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                const currentDate = new Date();
                const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
                const formattedDate = currentDate.toLocaleDateString([], options);
                const formattedTime = currentDate.toLocaleTimeString([], {
                    hour: '2-digit', minute: '2-digit',
                });
                setLastMessageTime(`${formattedTime} on ${formattedDate}`);
            }
        }
    }, [messages]);

    const simulateContactTyping = () => {
        setContactTyping(true);
        setTimeout(() => setContactTyping(false), 1500);
    };

    const nudgeMessage = 'You have just sent a nudge.';

    const handleNudgeClick = () => {
        const newMessages = [...messages, { role: 'user', content: nudgeMessage }];
        const audio = new Audio(sounds.nudge);
        audio.play();
        setShaking(true);
        setTimeout(() => {
            setShaking(false);
            setMessages(newMessages);
        }, 500);
    };

    return (
        <div

            ref={containerRef}
            className={`"p-1 md:p-5" ${shaking ? 'nudge' : ''}`}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '850px',
                maxHeight: '100px',
                zIndex: 10, // se quiser garantir sobreposição
                cursor: 'default',
            }}
        >

            <div
                id="chat-scope"
                ref={windowRef}
                className="win7 p-1 md:p-5"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '500px',
                    cursor: 'default',
                }}
            >


                <div data-scope="chat" className="window active">
                    <div className="title-bar">
                        <div className="title-bar-text flex items-center gap-2">
                            <img src="./wlm-logo.png" alt="MSN Icon" className="w-5 h-5" />
                            Furg Live Messenger
                        </div>
                        <div className="title-bar-controls">
                            <button aria-label="Close" onClick={() => closeIndividualChat()} />
                        </div>
                    </div>
                    <div className="window-body">
                        <div
                            className={`bg-no-repeat bg-[length:100%_100px] max-h-96 ${shaking ? 'nudge' : ''}`}
                            style={{ backgroundImage: 'url(/assets/background/background.jpg)' }}
                        >
                            <div className="flex flex-col w-full font-sans text-base h-full">
                                <div className="flex items-center w-full h-[31.4px] bg-white p-2 gap-2">
                                    <img src="/assets/chat/contact_chat_icon.png" alt="" />
                                    <p className="flex gap-1" dangerouslySetInnerHTML={{ __html: replaceEmoticons(selectedContact.username) }} />
                                    <p>&lt;{selectedContact.email}&gt;</p>
                                </div>
                                <div
                                    className="flex items-center justify-between h-[31.4px] bg-no-repeat shadow-lg"
                                    style={{ backgroundImage: 'url(/assets/background/chat_navbar_background.png)' }}
                                >
                                    <div className="flex gap-1 items-center aerobutton p-2 h-6">
                                        <div className="w-5">
                                            <img src="/assets/contacts/1489.png" alt="" />
                                        </div>
                                        <div>
                                            <img src="/assets/general/arrow_white.png" alt="" />
                                        </div>
                                    </div>
                                </div>

                                <Background>
                                    <div className="px-4 pt-4 grid grid-cols-[170px__1fr] h-full">
                                        <div className="h-full flex flex-col items-center justify-between">
                                            <AvatarLarge image={selectedContact.avatar} status={selectedContact.status} />
                                            <div>
                                                <AvatarLarge image={user.avatar} />
                                                <div className="h-10" />
                                            </div>
                                        </div>
                                        <div className="win7">
                                            <div className="flex items-center white-light mb-10">
                                                <p className="flex gap-1 text-lg" dangerouslySetInnerHTML={{ __html: replaceEmoticons(selectedContact.name) }} />
                                                <p className="ml-1 capitalize">({selectedContact.status})</p>
                                            </div>
                                            <img src="/assets/general/divider.png" alt="" className="mb-[-5px] pointer-events-none" />

                                            <div className="flex flex-col justify-between h-full w-full my-4 text-sm pr-2">
                                                <div id="message-container" className="overflow-y-auto break-all has-scrollbar">
                                                    {messages.map((message, index) => {
                                                        const prev = messages[index - 1];
                                                        return (
                                                            <div key={index} className={`message ${message.role}`}>
                                                                {message.content === nudgeMessage ? (
                                                                    <div>
                                                                        {prev && prev.content === nudgeMessage ? (
                                                                            <><p className="ml-1">{nudgeMessage}</p><p>━━━━</p></>
                                                                        ) : (
                                                                            <><p>━━━━</p><p className="ml-1">{nudgeMessage}</p><p>━━━━</p></>
                                                                        )}
                                                                    </div>
                                                                ) : message.role === 'user' ? (
                                                                    <div>
                                                                        <div className="flex text-black text-opacity-70">
                                                                            <p className="flex gap-1" dangerouslySetInnerHTML={{ __html: replaceEmoticons(user || userEmail) }} />
                                                                            <p className="ml-1">says:</p>
                                                                        </div>
                                                                        <div className="flex gap-2 items-start ml-1">
                                                                            <div className="flex-shrink-0 mt-2.5">
                                                                                <img src="/assets/chat/message_dot.png" alt="Message Dot" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="flex gap-1" dangerouslySetInnerHTML={{ __html: replaceEmoticons(message.content) }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <div className="flex text-black text-opacity-70">
                                                                            <p className="flex gap-1" dangerouslySetInnerHTML={{ __html: replaceEmoticons(selectedContact.name) }} />
                                                                            <p className="ml-1">says:</p>
                                                                        </div>
                                                                        <div className="flex gap-2 items-start ml-1">
                                                                            <div className="flex-shrink-0 mt-2.5">
                                                                                <img src="/assets/chat/message_dot.png" alt="Message Dot" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="flex gap-1" dangerouslySetInnerHTML={{ __html: replaceEmoticons(message.content) }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="w-full">
                                                    {contactTyping && (
                                                        <div className="flex gap-1">
                                                            <p className="flex" dangerouslySetInnerHTML={{ __html: replaceEmoticons(selectedContact.name) }} />
                                                            <p>is typing...</p>
                                                        </div>
                                                    )}
                                                    {lastMessageTime && <p className="opacity-50 my-1">Last message received at {lastMessageTime}</p>}
                                                    <img src="/assets/general/divider.png" alt="" className="pointer-events-none" />
                                                    <form onSubmit={handleSubmit}>
                                                        <input
                                                            type="text"
                                                            value={input}
                                                            onChange={(e) => setInput(e.target.value)}
                                                            className="w-full border rounded-t-[4px] outline-none p-1 border-[#bdd5df]"
                                                        />
                                                    </form>
                                                    <div>
                                                        <img className="absolute bottom-[68px] left-[173.6px]" src="/assets/background/chat_background_point.png" alt="" />
                                                    </div>
                                                    <div className="flex border-x border-b rounded-b-[4px] border-[#bdd5df]" style={{ backgroundImage: 'url(/assets/background/chat_icons_background.png)' }}>
                                                        <EmoticonSelector />
                                                        <WinkSelector />
                                                        <div className="flex items-center aerobutton p-1 h-6" onClick={handleNudgeClick}>
                                                            <img src="/assets/chat/send_nudge.png" alt="" />
                                                        </div>
                                                        <div className="px-2">
                                                            <img src="/assets/background/chat_icons_separator.png" alt="" />
                                                        </div>
                                                        <div className="flex items-center aerobutton p-1 h-6">
                                                            <img src="/assets/chat/change_font.png" alt="" />
                                                        </div>
                                                        <div className="flex items-center aerobutton p-1 h-6">
                                                            <img src="/assets/chat/select_background.png" alt="" />
                                                            <img src="/assets/general/arrow.png" alt="" />
                                                        </div>
                                                    </div>
                                                    <div className="h-[121px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Background>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
