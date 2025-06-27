import React, { useState, useEffect, useRef, useContext } from 'react';
import AvatarSmall from '../AvatarSmall';
import Dropdown from '../dropdown/Dropdown';
import statusFrames from '../../imports/statusFrames';
import { replaceEmoticons } from '../../helpers/replaceEmoticons';
import { AuthContext } from '../../context/AuthContext';

export default function Header() {
    const { user } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(user.bio);
    const inputRef = useRef(null);

    const options = [
        { value: 'online', label: 'Online', image: statusFrames.onlineDot },
        { value: 'busy', label: 'Busy', image: statusFrames.busyDot },
        { value: 'away', label: 'Away', image: statusFrames.awayDot },
        {
            value: 'offline',
            label: 'Appear offline',
            image: statusFrames.offlineDot,
        },
        { separator: true },
        { value: 'Sign out', label: 'Sign out' },
        { separator: true },
        { value: 'ChangeDisplayPicture', label: 'Change display picture...' },
        { value: 'ChangeScene', label: 'Change scene...' },
        { value: 'ChangeDisplayName', label: 'Change display name...' },
    ];

    const handleMessageClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        adjustInputWidth();
    };

    const handleInputBlur = () => {
        setUser({ ...user, message });
        localStorage.setItem('message', message);
        setIsEditing(false);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleInputBlur();
        }
    };

    const adjustInputWidth = () => {
        if (inputRef.current) {
            inputRef.current.style.width = `${inputRef.current.value.length}ch`;
        }
    };

    useEffect(() => {
        if (isEditing) {
            adjustInputWidth();
        }
    }, [isEditing]);

    const handleStatusChange = (status) => {
        setUser({ ...user, status });
        localStorage.setItem('status', status);
    };

    return (
        <div className="flex">
            <AvatarSmall />
            <div className="ml-[-12px]">
                <div className="flex items-center">
                    <Dropdown options={options} value={user.username} />
                </div>
                <div className="flex aerobutton pl-1 ml-1 items-center white-light" onClick={handleMessageClick}>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            autoFocus
                            className="border border-gray-300 rounded outline-none"
                            style={{ width: `${message.length}ch` }}
                        />
                    ) : (
                        <p className="cursor-pointer flex gap-1">
                            {!message ? (
                                'Share a quick message...'
                            ) : (
                                <span
                                    className="flex gap-1"
                                    dangerouslySetInnerHTML={{
                                        __html: replaceEmoticons(message),
                                    }}
                                ></span>
                            )}
                        </p>
                    )}
                    <div className="ml-1">
                        <img src="./assets/general/arrow.png" alt="arrow icon" />
                    </div>
                </div>
            </div>
        </div>
    );
};
