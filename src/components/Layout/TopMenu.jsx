import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../styles/sideTopMenu.css'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import useApiService from '../../services/ApiService';
import ShowLoader from '../loader/ShowLoader';
import HideLoader from '../loader/HideLoader';
import AlertComp from '../AlertComp';
import { UserContext } from '../../context/UserContext';
import { Logout } from '../../utils/js/Common';

export default function TopMenu() {
    const [openProfile, setOpenProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const { postAPI } = useApiService();
    const { userDetails } = useContext(UserContext);
    const profileRef = useRef(null);
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
    const handleLogout = async () => {
        setLoading(true);
        try {
            const result = await postAPI('/logout');
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message="User logged out successfully" />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        Logout();
                    }, 2000);
                }
                else {
                    Logout();
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className="topmenu-wrapper">
                <div className="position-relative" style={{ width: "40%" }}>
                    <img src={Images.searchIcon} alt="search-icon" className="search-icon" />
                    <input
                        type="text"
                        className="form-control searchInput"
                        placeholder="Search"
                    />
                </div>
                <div>
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
                                <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} className='pe-2' />Logout</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}
