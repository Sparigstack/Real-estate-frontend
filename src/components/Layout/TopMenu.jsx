import React, { useState } from 'react'
import '../../styles/sideTopMenu.css'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useApiService from '../../services/ApiService';
import ShowLoader from '../loader/ShowLoader';
import HideLoader from '../loader/HideLoader';
import AlertComp from '../AlertComp';
import Cookies from 'js-cookie';

export default function TopMenu() {
    const [openProfile, setOpenProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const { postAPI } = useApiService();
    const navigate = useNavigate();
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
                    setLoading(false);
                    Cookies.remove('authToken');
                    navigate('/login');
                }
                else {
                    // setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                    // setTimeout(() => {
                    //     setShowAlerts(<AlertComp show={false} />);
                    // }, 1500);
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
        <div className='pt-0 p-3 pe-0'>
            <div className='topmenu-wrapper px-4 py-3'>
                <div className="row">
                    <div className="col-4 position-relative">
                        <img src={Images.searchIcon} alt="search-icon" className='search-icon' />
                        <input type="text" className='form-control' placeholder="Search" style={{ paddingLeft: '45px', background: '#E4E6F6' }} />
                    </div>
                    <div className="col-8 position-relative text-end">
                        <img src={Images.profile} alt="profile" className='cursor-pointer' style={{ height: "45px" }} onClick={toggleProfile} />
                        {openProfile &&
                            <div className="px-3 py-2 text-start mt-1 position-absolute end-0">
                                <ul className="list-group custom-list-group">
                                    <li className="list-group-item cursor-pointer d-flex align-items-center" onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser} className="me-2" />Profile</li>
                                    <li className="list-group-item cursor-pointer d-flex align-items-center" onClick={handleLogout} ><FontAwesomeIcon icon={faSignOutAlt} className="me-2"/>Logout</li>
                                </ul>
                            </div>
                        }
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}
