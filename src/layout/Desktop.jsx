import React, { useState } from "react"
import Toolbar from "./Toolbar"
import Chat from "../components/modal/Chat";
import DesktopIcons from "./DesktopIcons";

export default function Desktop() {
    const [isChatActive, setIsChatActive] = useState(false);
    const [showChat, setShowChat] = useState(false);

    function openChat() {
        setShowChat(true);
        setIsChatActive(true);
    }

    function closeChat() {
        setShowChat(false);
        setIsChatActive(false);
    }

    return (
        <div
            className="h-screen w-full relative overflow-hidden bg-cover bg-center"
            style={{
                backgroundImage: `url('./assets/wallpapers/win7.jpg')`,
            }}
        >

            {!showChat && (
                <div className="absolute top-4 left-4">
                    <DesktopIcons showChat={showChat} onChatClick={openChat} />
                </div>
            )}

            {showChat && (
                <div className="w-full">
                    <Chat setShowChat={setShowChat} closeChat={closeChat} />
                </div>
            )}

            <div className="absolute bottom-0 w-full">
                <Toolbar showChat={showChat} isChatActive={isChatActive} openChat={openChat} closeChat={closeChat} />
            </div>
        </div>
    )
}