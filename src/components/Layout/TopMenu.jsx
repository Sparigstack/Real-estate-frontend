import React, { useEffect, useRef, useState } from 'react'
import Images from '../../utils/Images';
import useAuth from '../../hooks/useAuth';
import useProperty from '../../hooks/useProperty';
import { useNavigate } from 'react-router-dom';

export default function TopMenu() {
    const [openProfile, setOpenProfile] = useState(false);
    const { userDetails, logout } = useAuth();
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const { handleSwitchProperty, propertyDetails } = useProperty();
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
                    <label className={'fontwhite mb-0 d-flex align-items-center'}>
                        <label className='fw-semibold font-16'>
                            <img src={Images.scheme} className='img-fluid bigiconsize pe-2' />
                            <label>{propertyDetails.name}</label>
                        </label>
                        <label className='ps-2 mt-1 font-13 d-flex align-items-center'>
                            <img src={Images.location} className='img-fluid' style={{ height: "15px" }} />
                            <label className='graycolor ps-1'>{propertyDetails.city_name}</label>
                        </label>
                    </label>
                </label>
                <div>
                    <label className='colorAAB8FF cursor-pointer font-13 fw-semibold' onClick={(e) => navigate("/modules")}
                        style={{ borderBottom: "1px solid #AAB8FF" }}>
                        <img src={Images.upgrade_plan} className='iconsize pe-1 pb-1' />
                        Pricing
                    </label>
                    <label className='fontwhite fw-semibold font-12 px-3 cursor-pointer' onClick={handleSwitchProperty}>
                        <img src={Images.scheme} className='img-fluid iconsize pe-2' />My Schemes</label>
                    <button className="profileOpen" onClick={toggleProfile}>
                        {userDetails?.userName?.charAt(0).toUpperCase()}
                    </button>
                    {openProfile && (
                        <div className="profile-menu" ref={profileRef}>
                            <ul>
                                <li className='py-1 px-0 pb-3'>
                                    <a className="dropdown-item" href="#">
                                        <div className="d-flex align-items-center">
                                            <div className="profileOpen">
                                                <span>{userDetails?.userName?.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="ms-3">
                                                <h6 className="mb-0 dropdown-user-name" style={{ color: "black" }}>{userDetails?.userName}</h6>
                                                <small className="mb-0 dropdown-user-designation text-secondary" style={{ fontSize: '12px' }}>{userDetails?.companyname}</small>
                                            </div>
                                        </div>
                                    </a>
                                </li>

                                <li className='font-14 p-1' onClick={logout}>
                                    <img src={Images.logout_icon} className='ps-1 pe-3' />
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}
