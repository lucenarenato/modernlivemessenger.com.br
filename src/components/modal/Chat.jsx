import React, { useEffect, useRef } from 'react';
import '7.css/dist/7.css';
import DesktopIcons from '../../layout/DesktopIcons';
import Auth from '../authentication/Auth';
import Footer from '../Footer';

export default function Chat({ setShowChat, closeChat }) {
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

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>

            <div className="absolute left-4 top-4">
                <DesktopIcons showChat={false} />
            </div>

            <div
                id="chat-scope"
                ref={windowRef}
                className="p-1 md:p-5"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '550px',
                    maxHeight: '700px',
                    cursor: 'default',
                }}
            >


                <div className="window active">
                    <div className="title-bar">
                        <div className="title-bar-text flex items-center gap-2">
                            <img src="./wlm-logo.png" alt="MSN Icon" className="w-5 h-5" />
                            Furg Live Messenger
                        </div>
                        <div className="title-bar-controls">
                            <button aria-label="Minimize" onClick={() => setShowChat(false)} />
                            <button aria-label="Close" onClick={() => closeChat()} />
                        </div>
                    </div>
                    <div className="window-body">
                        <Auth />
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}
