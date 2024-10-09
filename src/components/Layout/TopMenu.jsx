import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faGauge, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import Images from '../../utils/Images';
import useAuth from '../../hooks/useAuth';
import useProperty from '../../hooks/useProperty';
import Cookies from 'js-cookie';

export default function TopMenu() {
    const [openProfile, setOpenProfile] = useState(false);
    const { userDetails, logout } = useAuth();
    const profileRef = useRef(null);
    const propertyName = Cookies.get('propertyName');
    const { handleSwitchProperty } = useProperty();
    useEffect(() => {
        console.log(propertyName)
    }, [propertyName]);

    useEffect(() => {
        if (openProfile) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        else {
            document.removeEventListener('mouseup', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [openProfile])
    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setOpenProfile(false);
        }
    }
    const toggleProfile = () => {
        setOpenProfile(!openProfile);
    }
    return (
        <>
            <div className="topmenu-wrapper">
                <label>
                    <h4 className={'fontwhite mb-0'}>
                        <img src={Images.scheme} className='img-fluid pe-2' />
                        {propertyName}</h4>
                </label>
                <div>
                    <label className='fontwhite pe-3 cursor-pointer' onClick={handleSwitchProperty}><FontAwesomeIcon icon={faBuilding} className='pe-2' />Switch Scheme</label>
                    <button className="profileOpen" onClick={toggleProfile}>
                        {userDetails?.userName?.charAt(0).toUpperCase()}
                    </button>
                    {openProfile && (
                        <div className="profile-menu" ref={profileRef}>
                            <ul>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <div className="d-flex align-items-center">
                                            <div className="profileOpen">
                                                <span>{userDetails?.userName?.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="ms-3">
                                                <h5 className="mb-0 dropdown-user-name" style={{ color: "black" }}>{userDetails?.userName}</h5>
                                                <small className="mb-0 dropdown-user-designation text-secondary" style={{ fontSize: '12px' }}>{userDetails?.email}</small>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <hr className='m-0 p-0' />

                                <li><FontAwesomeIcon icon={faUser} className='pe-2' />Profile</li>
                                <li><FontAwesomeIcon icon={faGauge} className='pe-2' />Dashboard</li>
                                <li onClick={logout}><FontAwesomeIcon icon={faSignOutAlt} className='pe-2' />Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}
