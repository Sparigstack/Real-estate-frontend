import React, { useContext, useState } from 'react'
import Images from '../../utils/Images'
import { NavLink } from 'react-router-dom'
import '../../styles/sideTopMenu.css'
import SideMenuItems from '../../json/SideMenuItems.json'
import { UserContext } from '../../context/UserContext'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function SideMenu() {
    const {userDetails} = useContext(UserContext);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleToggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };
    return (
        <div className='side-menu'>
            <div className='px-4 pt-3 pb-4'>
                <img src={userDetails?.companyLogo || Images.dummyRealEstateLogo} alt="logo" className='w-100' style={{maxHeight:'60px'}}/>
            </div>
            <ul className="nav nav-pills flex-column p-2 pt-4 sidemenuDropList">
                {SideMenuItems.map((item, index) => (
                    <li className="nav-item d-flex align-items-center pb-2" key={index}>
                        {item.label == 'Property' ? (
                            <div>
                                <div className="text-white fw-light cursor-pointer text-decoration-none d-flex align-items-center" onClick={handleToggleSubMenu}>
                                    <img src={Images[item.imageKey]} className="me-3" alt={item.altText} />
                                    {item.label}
                                    <FontAwesomeIcon icon={faAngleRight} className={` dropdown-icon ms-3 ${isSubMenuOpen ? 'rotate-icon' : ''}`} />
                                </div>
                                {isSubMenuOpen && (
                                    <div className="sub-menu mt-3">
                                        <ul>
                                            <li><NavLink to="/add-property" className={({ isActive }) => (isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light')}>Add Property</NavLink></li>
                                            <li><NavLink to="/commercial" className={({ isActive }) => (isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light')}>Commercial</NavLink></li>
                                            <li><NavLink to="/residential" className={({ isActive }) => (isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light')}> Residential</NavLink></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink to={item.path} className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'} style={{fontSize:'16px'}}><img src={Images[item.imageKey]} className={`me-2`} alt={item.altText} />{item.label}</NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
