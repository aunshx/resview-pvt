import { Tooltip } from "@mui/material";
import cn from "classnames";
import React, { memo, useContext } from "react";
import {
  homeIcon,
  linearGraphIcon,
  moonIcon,
  sunIcon,
  teamIcon
} from "../../Resources/Icons";
import ResViewLogo from "../../Resources/Images/ResViewLogo.jpg";
import { COLOR_LIGHT, ICON_DEFAULT_COLOR, SUN_COLOR } from "./Constants";
import { Icon } from "./Icon";
import { ThemeContext } from "../../Context/theme";
import _ from "lodash";
import { NavbarToggleContext } from "../../Context/navbarToggle";

const navbarPageActiveColor = (currentPage, pageName) => {
  return currentPage === pageName ? COLOR_LIGHT : ICON_DEFAULT_COLOR;
};

const LightOrDark = memo(() => {
  const { theme, toggleLightTheme, toggleDarkTheme } = useContext(ThemeContext);

  return (
    <Tooltip
      title={cn({ "Light Mode": !theme }, { "Dark Mode": theme })}
      enterDelay={500}
    >
      <div
        className={cn(
          "cursor-pointer",
          {
            "svg-hover-light": !theme,
          },
          {
            "svg-hover-dark": theme,
          }
        )}
        onClick={!theme ? toggleDarkTheme : toggleLightTheme}
      >
        {!theme ? (
          <Icon fill={SUN_COLOR} height={"1.4em"} path={sunIcon} />
        ) : (
          <Icon fill={ICON_DEFAULT_COLOR} height={"1.4em"} path={moonIcon} />
        )}
      </div>
    </Tooltip>
  );
});

const NavLink = ({
  title,
  currentPage,
  page,
  icon,
  iconHeight,
  iconViewBox,
}) => (
  <Tooltip title={title} enterDelay={500}>
    <a href={`/pages/${page}`} className={cn(
      'cursor-pointer font-bold text-gray-900 dark:text-white',
      {'dark:bg-green-80 bg-green-40 px-2 py-1 rounded-lg transition': currentPage==page},
    )}>
      {/* <Icon
        fill={navbarPageActiveColor(currentPage, page)}
        height={iconHeight}
        path={icon}
        viewBox={iconViewBox}
      /> */}
      {_.capitalize(page)}
    </a>
  </Tooltip>
);

const Navbar = memo(() => {
  const { theme } = useContext(ThemeContext);
  const { borderToggle } = useContext(NavbarToggleContext);

  const CURRENT_PAGE = window.location.href.split("/")[4];
  const logo = theme ? 'https://i.postimg.cc/jd6PkhDs/Res-View-Logo-Dark.png' : 'https://i.postimg.cc/Y0dMy9mf/Copy-of-Untitled-Design-removebg-preview.png';
  return (
    <>
      <div class={cn(
        'w-full py-[1em] px-8 text-white lg:px-8 lg:py-4 flex items-center justify-between flex-initial fixed top-0 z-20',
        {'border-b-2 dark:bg-blue-400 bg-blue-20 border-gray-900 dark:border-white transition': borderToggle}
      )}>
        <div className='flex items-center justify-center gap-x-2 w-full'>
          <a href='/'>
            <img
              src={logo}
              alt='ResDb View Logo'
              className='h-35p w-35p'
            />
          </a>
          <div className='text-blue-190 text-20p font-sans font-bold'>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">ResView</span>
          </div>
        </div>
        <div></div>
        <div className='flex items-center justify-center gap-x-12 w-full'>
          <NavLink
            title={"Home"}
            currentPage={CURRENT_PAGE}
            page={"home"}
            icon={homeIcon}
            iconHeight={"1.4em"}
            iconViewBox={"0 0 640 512"}
          />
          <NavLink
            title={"Our Team"}
            currentPage={CURRENT_PAGE}
            page={"team"}
            icon={teamIcon}
            iconHeight={"1.4em"}
            iconViewBox={"0 0 640 512"}
          />
          <a href={`https://medium.com/@aunsh/resview-a-pbft-visualizer-based-on-the-resilientdb-blockchain-fabric-3ffaeb2aaee5`} target="_blank" rel="noreferrer nofollow" className={cn(
            'cursor-pointer font-bold text-gray-900 dark:text-white'
          )}>
            Blog
          </a>
          <NavLink
            title={"Visualizer"}
            currentPage={CURRENT_PAGE}
            page={"visualizer"}
            icon={linearGraphIcon}
            iconHeight={"1.5em"}
          />

          {/* // ! IMPORTANT: DELETE THE BELOW AFTER VISUALZER IS COMPLETE */}
          <NavLink
            title={"Dashboard"}
            currentPage={CURRENT_PAGE}
            page={"dashboard"}
            icon={linearGraphIcon}
            iconHeight={"1.5em"}
          />
          <LightOrDark />
        </div>
      </div>
    </>
  );
});

export default Navbar;
