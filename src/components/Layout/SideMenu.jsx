import React, { useState } from 'react';
import Images from '../../utils/Images';
import { NavLink, useLocation } from 'react-router-dom';
import SideMenuItems from '../../json/SideMenuItems.json';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SideMenu() {
    const [openMenus, setOpenMenus] = useState({});
    const location = useLocation();

    const handleToggleSubMenu = (index) => {
        setOpenMenus((prevOpenMenus) => {
            const updatedMenus = {};
            updatedMenus[index] = !prevOpenMenus[index];
            return updatedMenus;
        });
    };

    return (
        <div className='side-menu'>
            <div className='py-3 text-center side-menu-logo'>
                <img src={Images.realEstateLogo} alt="logo" className='logosize' />
            </div>
            <ul className="nav nav-pills flex-column pt-4 sidemenuDropList">
                {SideMenuItems.map((item, index) => (
                    <li className="nav-item pb-2" key={index}>
                        <div className='d-flex align-items-center w-100 justify-content-between px-2'>
                            {item.submenu.length > 0 ? (
                                <div
                                    className='nav-link d-flex w-100 text-white fw-light px-2'
                                    onClick={() => handleToggleSubMenu(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={Images[item.imageKey]} className="me-3 leftmenuicon" alt={item.altText} />
                                    <label className='cursor-pointer'>{item.label}</label>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    onClick={() => handleToggleSubMenu(index)}
                                    className={
                                        openMenus[index]
                                            ? 'nav-link d-flex active text-white fw-bold px-2'
                                            : 'nav-link d-flex text-white fw-light px-2'
                                    }
                                >
                                    <img src={Images[item.imageKey]} className="me-3 leftmenuicon" alt={item.altText} />
                                    <label className='cursor-pointer'>{item.label}</label>
                                </NavLink>
                            )}
                            {item.submenu.length > 0 && (
                                openMenus[index] ? (
                                    <FontAwesomeIcon
                                        icon={faSortUp}
                                        style={{ color: "white" }}
                                        className={`dropdown-icon`}
                                        onClick={() => handleToggleSubMenu(index)}
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faSortDown}
                                        style={{ color: "white" }}
                                        className={`dropdown-icon`}
                                        onClick={() => handleToggleSubMenu(index)}
                                    />
                                )
                            )}
                        </div>

                        {/* Submenu section */}
                        {item.submenu.length > 0 && openMenus[index] && (
                            <div className="sub-menu p-2">
                                <ul className='ps-2'>
                                    {item.submenu.map((submenuitem, subIndex) => (
                                        <li key={subIndex}>
                                            <NavLink
                                                to={submenuitem.path}
                                                className={
                                                    location.pathname === submenuitem.path
                                                        ? 'nav-link d-flex active text-white fw-bold px-2'
                                                        : 'nav-link d-flex text-white fw-light px-2'
                                                }
                                            >
                                                <img src={Images[submenuitem.imageKey]} className="me-3 leftmenuicon" alt={submenuitem.altText} />
                                                <label className='cursor-pointer'>{submenuitem.label}</label>
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
