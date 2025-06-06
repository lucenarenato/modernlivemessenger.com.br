import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Badge } from "@mui/material";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import Logo from '../Logo';
import { useAuth } from '../../context/AuthContext';
import ThemeSelector from "./ThemeSelector";
import getActualRoute from "../../utils/getActualRoute";
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';

const ItemTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, currentTheme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: currentTheme === 'dark' ? '#27272A' : '#27272A',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: currentTheme === 'dark' ? '#27272A' : '#27272A',
        color: currentTheme === 'dark' ? '#FFFFFF' : '#FFFFFFF',
        fontSize: '13px',
    },
}));

export default function Navbar() {
    const { t } = useTranslation('navigation');

    const { getTotalQuantity } = useContext(CartContext);

    const { handleUser, user } = useAuth();

    const actualRoute = getActualRoute();
    const defaultClassName = "relative py-4 px-2 h-full flex justify-center items-center text-gray-600 dark:text-gray-300 mb-0.5 hover:text-[#f9305b] dark:hover:text-[#f9305b] hover:underline-hover";
    const activeClassName = "relative py-4 px-2 border-b-2 border-primary/90 h-full flex justify-center items-center text-[#f9305b] dark:text-[#f9305b] underline-active";
    
    return (
        <div className="w-full fixed z-50 top-0 left-0 right-0 bg-white/70 dark:bg-neutral-950/80 dark:border-neutral-800 backdrop-blur-md border-b border-gray-100">

        <nav
          id="navbar"
          className="flex flex-row justify-between items-center text-main-color px-3 max-w-6xl mx-auto"
        >
          <div className="flex items-center flex-row gap-5 items-center justify-start">
            <div className="w-10 text-primary">
              <Logo />
            </div>

            <nav className="flex flex-row items-center mt-1.5 gap-3">
              <NavLink to="/home">
                <div className={actualRoute === "home" ? activeClassName : defaultClassName}>
                  {t("home")}
                </div>
              </NavLink>

              <NavLink to="/about">
                <div className={actualRoute === "about" ? activeClassName : defaultClassName}>
                  About us
                </div>
              </NavLink>
            </nav>
          </div>

          <div className="flex flex-row justify-end mt-1.5">
            <ItemTooltip title={user ? user.name : t("user")} placement="bottom">
              <div
                className={`flex justify-center border-b-2 ${
                    actualRoute === "profile" ? "border-primary" : "border-none mb-0.5"
                } items-center px-3 py-4 text-gray-200 cursor-pointer`}
                onClick={handleUser}
                >
                {user ? (
                    <img src={user.picture != "" ? user.picture : "https://i.imgur.com/oYEFKb1.png"} alt="User" className="rounded-full w-6 h-6" />
                ) : (
                    <PersonOutlineOutlinedIcon className="text-gray-700 dark:text-neutral-200" />
                )}
              </div>
            </ItemTooltip>

            <NavLink
              to="/checkout"
              className={`flex justify-center border-b-2 ${
                  actualRoute === "checkout" ? "border-primary" : "border-none mb-0.5"
                } items-center px-3 py-4 text-gray-200 cursor-pointer`}
                >
              <Badge badgeContent={getTotalQuantity()} color="primary">
                <ShoppingCartOutlinedIcon className="text-gray-700 dark:text-neutral-200" />
              </Badge>
            </NavLink>

            <ItemTooltip title={t("theme")} placement="bottom">
              <div className="flex-col justify-center items-center pl-3 py-4 mb-0.5 text-gray-700 dark:text-neutral-200 rounded-lg">
                <ThemeSelector />
              </div>
            </ItemTooltip>
          </div>
        </nav>
      </div>
    );
}
