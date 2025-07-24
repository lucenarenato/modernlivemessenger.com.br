import React, { useState, useEffect, useRef, useContext } from 'react';
import ChangeDisplayPictureModal from './ChangeDisplayPictureModal';
import ChangeSceneModal from './ChangeSceneModal';
import ChangeNameAndBio from './ChangeNameAndBio';
import { replaceEmoticons } from '../../helpers/replaceEmoticons';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

export default function Dropdown({ options, showStatusDots = false }) {
    const { user, changeStatus } = useContext(AuthContext);
    const { logout } = useContext(ChatContext);

    const [changePictureShowModal, setShowChangePictureModal] = useState(false);
    const [showChangeNameAndBio, seShowChangeNameAndBio] = useState(false);
    const [showChangeBannerModal, setShowChangeBannerModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === user.status) || options[0]);
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    const handleOptionClick = (option) => {
        switch (option.value) {
            case 'online':
            case 'busy':
            case 'away':
            case 'offline':
                setSelectedOption(option);
                changeStatus(option.value)
                setIsOpen(false);
                break;
            case 'Sign out':
                logout()
                break;
            case 'ChangeDisplayPicture':
                setShowChangePictureModal(true);
                break;
            case 'ChangeScene':
                setShowChangeBannerModal(true);
                break;
            case 'ChangeDisplayName':
                seShowChangeNameAndBio(true);
                break;
            default:
                break;
        }
        setIsOpen(false);
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div onClick={handleToggleDropdown} className="flex aerobutton cursor-pointer items-center px-1 ml-1 white-light">
                <div className="flex items-center">
                    {showStatusDots && selectedOption.image && (
                        <img src={selectedOption.image} alt={selectedOption.label} className="inline-block mt-0.5 mr-1 w-2" />
                    )}

                    {user &&
                        (user.username !== '' ? (
                            <span
                                className="flex gap-1 text-lg items-baseline"
                                dangerouslySetInnerHTML={{ __html: replaceEmoticons(user.username) }}
                            />
                        ) : (
                            <span
                                className="flex gap-1 text-lg items-baseline"
                                dangerouslySetInnerHTML={{ __html: replaceEmoticons(user.email) }}
                            />
                        ))}

                    <p className="ml-1 capitalize">({selectedOption.label})</p>
                </div>
                <img src="/assets/general/arrow.png" className="inline-block mb-0.5 ml-2" alt="Toggle Dropdown" />
            </div>

            {isOpen && (
                <ul className="absolute bg-white border border-gray-300 rounded shadow w-[300px] mt-1 z-10 py-1">
                    {options.map((option, index) =>
                        option.separator ? (
                            <li key={`separator-${index}`} className="border-t my-1"></li>
                        ) : (
                            <li
                                key={option.value}
                                className="px-4 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.image ? (
                                    <img src={option.image} alt={option.label} className="inline-block mt-0.5 mr-2 w-2" />
                                ) : (
                                    <div className="w-4" />
                                )}
                                {option.label}
                            </li>
                        )
                    )}
                </ul>
            )}

            {changePictureShowModal && <ChangeDisplayPictureModal setShowChangePictureModal={setShowChangePictureModal} />}
            {showChangeBannerModal && <ChangeSceneModal setShowChangeBannerModal={setShowChangeBannerModal} />}
            {showChangeNameAndBio && <ChangeNameAndBio seShowChangeNameAndBio={seShowChangeNameAndBio} />}
        </div>
    );
};
