import React, { useContext, useState } from 'react';
import '7.css/dist/7.scoped.css'

import { ToastContext } from '../../context/ToastContext';
import { AuthContext } from '../../context/AuthContext';

export default function ChangeNameAndBio({ isOpen, onClose, seShowChangeNameAndBio }) {
    if (!isOpen) return null;

    const { user, changeBio, changeUsername } = useContext(AuthContext);

    const [initialState, setInitialState] = useState({
        bio: user.bio,
        username: user.username,
    });

    const [bio, setBio] = useState(user.bio);
    const [username, setUsername] = useState(user.username);
    const [isModified, setIsModified] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useContext(ToastContext);

    const handleMessageChange = (e) => {
        setBio(e.target.value);
        setIsModified(true);
    };

    const handleNameChange = (e) => {
        setUsername(e.target.value);
        setIsModified(true);
    };


    const handleApplyChanges = () => {
        if (isModified) {
            changeUsername(username)
            changeBio(bio)
            setIsModified(false);
        }
    };

    const handleOk = () => {
        handleApplyChanges();
        seShowChangeNameAndBio(false);
    };

    const handleCloseModal = () => {
        seShowChangeNameAndBio(false);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-xs">
            <div
                className="window active"
                style={{
                    width: '300px',
                    maxWidth: '90%',
                    zIndex: 1000,
                }}
            >
                <div className="title-bar">
                    <div className="title-bar-text flex items-center gap-2">
                        <img src="/assets/general/wlm-icon.png" alt="WLM Icon" />
                        Change username and bio
                    </div>
                    <div className="title-bar-controls">
                        <button aria-label="Close" onClick={onClose}></button>
                    </div>
                </div>
                <div className="window-body">
                    <div className="flex flex-col gap-2 p-5">
                        <div className="flex pl-2 h-full w-full">
                            <div className="w-full pr-1">
                                <fieldset className="border border-black border-opacity-10 h-full">
                                    <legend className="font-bold ml-2">Personal</legend>
                                    <div className="flex gap-1 mt-2">
                                        <p className="ml-6">Display Name</p>
                                        <div className="mt-[10px]">
                                            <img src="/assets/general/subtitles_line_options.png" />
                                        </div>
                                    </div>
                                    <div className="ml-12 mt-1">
                                        <div>
                                            <p>Type your name as you want others to see it:</p>
                                            <input
                                                type="text"
                                                className="w-[145px] border border-black border-opacity-25 h-6 mt-1 outline-none"
                                                value={username}
                                                onChange={handleNameChange}
                                            />
                                        </div>
                                        <div className="mt-1">
                                            <p>Type a personal message for your contacts to see:</p>
                                            <input
                                                type="text"
                                                className="w-[290px] border border-black border-opacity-25 h-6 mt-1 outline-none"
                                                value={bio}
                                                onChange={handleMessageChange}
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        {/*footer*/}
                        <div className="flex items-center justify-end rounded-b win7 p-3 gap-1.5">
                            <button type="button" onClick={handleOk}>
                                OK
                            </button>
                            <button type="button" onClick={handleCloseModal}>
                                Cancel
                            </button>
                            <button type="button" onClick={handleApplyChanges} disabled={!isModified}>
                                Apply
                            </button>
                            <button disabled type="button">Help</button>
                        </div>

                        <div className="field-row mt-3 justify-end">
                            <button type="submit" className="default" disabled={isLoading}>
                                {isLoading ? 'Enviando...' : 'Enviar pedido'}
                            </button>
                            <button type="button" onClick={onClose}>Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
