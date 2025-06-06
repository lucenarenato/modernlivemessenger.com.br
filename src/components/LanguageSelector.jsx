import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as Popover from '@radix-ui/react-popover';

const locales = {
    "pt-BR": { title: "PT-BR", iconPath: "./flags/br.svg" },
    "en-US": { title: "EN-US", iconPath: "./flags/us.svg" },
    "es-ES": { title: "ES-ES", iconPath: "./flags/es.svg" }
};

export default function LanguageSelector({ showTitle }) {
    const { i18n } = useTranslation();
    const actualLanguage = i18n.language;

    // Função para mudar o idioma
    const changeSystemsLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const buttonRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState(0);

    useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth + 8);
        }
    }, [buttonRef.current]);

    return (
        <div className="flex flex-row gap-2 z-50">
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button ref={buttonRef} className="flex dark:text-neutral-200 text-gray-700 hover:text-white flex-row items-center hover:bg-gray-500 dark:hover:bg-zinc-800 py-2 px-2">
                        <img
                            className="w-5 h-5 rounded-full object-cover mr-2"
                            src={locales[actualLanguage].iconPath}
                            alt={locales[actualLanguage].title}
                        />
                        
                        <div className="text-sm font-semibold">
                            {locales[actualLanguage].title}
                        </div>
                         
                        <KeyboardArrowDownIcon className='text-md'/>
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content
                        style={{ width: buttonWidth }}
                        className="flex backdrop-blur-[4px] z-50 py-2 flex-col animation-duration-400 will-change-transform opacity focus:outline-none"
                        sideOffset={5}
                    >
                        {Object.keys(locales).filter(language => language !== actualLanguage).map((language) => (
                            <Popover.Close asChild key={language}>
                                <button
                                    className="flex flex-row items-center gap-2 px-3 dark:text-neutral-200 py-2 z-100 hover:bg-gray-500 hover:text-white dark:hover:bg-zinc-800"
                                    onClick={() => changeSystemsLanguage(language)}
                                >
                                    <img
                                        className="w-5 h-5 rounded-full object-cover"
                                        src={locales[language].iconPath}
                                        alt={locales[language].title}
                                    />

                                    <div className="text-sm font-semibold">
                                        {locales[language].title}
                                    </div>
                                </button>
                            </Popover.Close>
                        ))}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
}
