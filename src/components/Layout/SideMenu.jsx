import React, { useState } from 'react';
import Images from '../../utils/Images';
import { NavLink } from 'react-router-dom';
import '../../styles/sideTopMenu.css';
import SideMenuItems from '../../json/SideMenuItems.json';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideMenu() {
    // Initialize state for tracking which submenus are open
    const [openMenus, setOpenMenus] = useState({});

    const handleToggleSubMenu = (index) => {
        setOpenMenus((prevOpenMenus) => ({
            ...prevOpenMenus,
            [index]: !prevOpenMenus[index]  // Toggle the clicked submenu
        }));
    };

    return (
        <div className='side-menu'>
            <div className='px-4 pt-3 pb-4 text-center side-menu-logo'>
                <img src={Images.realEstateLogo} alt="logo" />
            </div>
            <ul className="nav nav-pills flex-column p-2 pt-4 sidemenuDropList">
                {SideMenuItems.map((item, index) => (
                    <li className="nav-item pb-2" key={index}>
                        <div className='d-flex align-items-center w-100 justify-content-between'>
                            {item.submenu.length > 0 ? (
                                <div
                                    className='nav-link w-100 text-white fw-light px-2'
                                    onClick={() => handleToggleSubMenu(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={Images[item.imageKey]} className="me-3 leftmenuicon" alt={item.altText} />
                                    {item.label}
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link active text-white fw-bold px-2' : 'nav-link text-white fw-light px-2'
                                    }
                                >
                                    <img src={Images[item.imageKey]} className="me-3 leftmenuicon" alt={item.altText} />
                                    {item.label}
                                </NavLink>
                            )}
                            {item.submenu.length > 0 && (
                                openMenus[index] ? (
                                    <FontAwesomeIcon
                                        icon={faChevronUp}
                                        style={{ color: "white" }}
                                        className={`dropdown-icon`}
                                        onClick={() => handleToggleSubMenu(index)}
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        style={{ color: "white" }}
                                        className={`dropdown-icon`}
                                        onClick={() => handleToggleSubMenu(index)}
                                    />
                                )
                            )}
                        </div>

                        {/* Submenu section */}
                        {item.submenu.length > 0 && openMenus[index] && (
                            <div className="sub-menu">
                                <ul>
                                    {item.submenu.map((submenuitem, subIndex) => (
                                        <li key={subIndex}>
                                            <NavLink
                                                to={submenuitem.path}
                                                className={({ isActive }) =>
                                                    isActive ? 'nav-link active text-white fw-bold px-2' : 'nav-link text-white fw-light px-2'
                                                }
                                            >
                                                <img src={Images[submenuitem.imageKey]} className="me-3 leftmenuicon" alt={submenuitem.altText} />
                                                {submenuitem.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
