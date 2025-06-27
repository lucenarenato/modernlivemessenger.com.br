import React, { useContext, useEffect, useState } from 'react';

import { replaceEmoticons } from '../../helpers/replaceEmoticons';
import { ChatContext } from '../../context/ChatContext';


export default function Contacts() {
    const { contacts, getContacts } = useContext(ChatContext);

    const favoritesContacts = contacts.filter((contact) => contact.isFavorite);
    const groupsContacts = contacts.filter((contact) => contact.status === 'group');
    const availableContacts = contacts.filter((contact) => contact.status !== 'offline' && contact.status !== 'group' && !contact.isFavorite);
    const offlineContacts = contacts.filter((contact) => contact.status === 'offline');

    useEffect(() => {
        if (contacts.length == 1) {
            getContacts()
        }
    }, [])

    return (
        <div>
            <ContactCategory title="Favorites" contacts={favoritesContacts} count={favoritesContacts.length} />
            <ContactCategory title="Groups" contacts={groupsContacts} count={groupsContacts.length} />
            <ContactCategory title="Available" contacts={availableContacts} count={availableContacts.length} />
            <ContactCategory title="Offline" contacts={offlineContacts} count={offlineContacts.length} />
        </div>
    )
}


const ContactCategory = ({ title, contacts, count }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mt-2">
            <div className="flex items-center cursor-pointer ml-1 hovercontact border border-transparent" onClick={toggleAccordion}>
                <h2>
                    {isOpen ? (
                        <img src="/assets/general/closed_tab_arrow.png" alt="close tab" />
                    ) : (
                        <img src="/assets/general/open_tab_arrow.png" alt="open tab" />
                    )}
                </h2>
                {title === 'Favorites' && (
                    <img src="/assets/general/favorites.png" className="mr-1" alt="favorites icon" />
                )}
                <p className="text-[#1D2F7F] mr-1">{title}</p>
                <p className="opacity-40">({count})</p>
            </div>
            {isOpen && <ContactList contacts={contacts} />}
        </div>
    );
};

const Contact = ({ contact }) => {
    const { selectContact } = useContext(ChatContext);

    const whichStatus = (contactStatus) => {
        switch (contactStatus) {
            case 'online':
                return '/assets/status/online-dot.png';
            case 'busy':
                return '/assets/status/busy-dot.png';
            case 'away':
                return '/assets/status/away-dot.png';
            case 'offline':
            default:
                return '/assets/status/offline-dot.png';
        }
    };

    const openChat = (contact) => {
        selectContact(contact.id)
    };

    return (
        <div className="flex gap-1 px-6 items-center hovercontact border border-transparent" onClick={() => openChat(contact)}>
            <div className="w-2">
                <img src={whichStatus(contact.status)} alt="contact-status" />
            </div>
            <span className="flex gap-1 text-sm" dangerouslySetInnerHTML={{ __html: replaceEmoticons(contact.username) }}></span>
            <span>{!contact.message ? null : '-'}</span>
            <span className="flex gap-1 text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: replaceEmoticons(contact.bio) }}></span>
        </div>
    );
};

const ContactList = ({ contacts }) => {
    return (
        <div className="accordion">
            {contacts
                .slice()
                .sort((a, b) => a.username.localeCompare(b.username))
                .map((contact) => (
                    <Contact key={contact.id} contact={contact} />
                ))}
        </div>
    );
};
