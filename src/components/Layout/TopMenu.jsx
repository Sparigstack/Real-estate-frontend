import React, { useContext, useState } from 'react'
import '../../styles/sideTopMenu.css'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useApiService from '../../services/ApiService';
import ShowLoader from '../loader/ShowLoader';
import HideLoader from '../loader/HideLoader';
import AlertComp from '../AlertComp';
import Cookies from 'js-cookie';
import { useCol } from 'react-bootstrap/esm/Col';
import { UserContext } from '../../context/UserContext';
import { Logout } from '../../utils/js/Common';

export default function TopMenu() {
    const [openProfile, setOpenProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const { postAPI } = useApiService();
    const navigate = useNavigate();
    const { userDetails } = useContext(UserContext);

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
                    }, 1500);
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
            <div className='pt-0 pe-0 sticky-top'>
                <div className='topmenu-wrapper px-4 py-2'>
                    <div className="row">
                        <div className="col-4 position-relative">
                            <img src={Images.searchIcon} alt="search-icon" className='search-icon' />
                            <input type="text" className='form-control' placeholder="Search" style={{ paddingLeft: '45px', background: '#E4E6F6' }} />
                        </div>
                        <div className="col-8 position-relative text-end">
                            {/* <img src={Images.dummyProfile} alt="profile" className='cursor-pointer' style={{ height: "45px",borderRadius:'50px' }} onClick={toggleProfile} /> */}
                            <button className="profileOpen" onClick={toggleProfile}>
                                {userDetails?.userName.charAt(0).toUpperCase()}
                            </button>
                            {openProfile &&
                                <div className="chartWrapper px-3 py-2 text-start mt-1 position-absolute" style={{right:'20px'}}>
                                    <div className="d-flex align-items-center">
                                        <div className="profileOpen">
                                        {(userDetails?.userName ? userDetails.userName.charAt(0).toUpperCase() : userDetails?.companyEmail.charAt(0).toUpperCase())}
                                        </div>
                                        <div>
                                            <p className="mb-0 ms-1 fs-5">{userDetails?.userName || userDetails?.companyEmail}</p>
                                            {/* <p className="mb-0 ms-1 text-secondary" style={{ fontSize: '15px' }}>{userDetails?.companyEmail}</p> */}
                                            <p className="mb-0 ms-1 text-secondary" style={{ fontSize: '15px' }}>{userDetails?.userName ? userDetails?.companyEmail : ''}</p>
                                        </div>
                                    </div>
                                    <hr className="mb-2 mt-2"/>
                                    <ul className="list-group custom-list-group">
                                        <li className="list-group-item cursor-pointer d-flex align-items-center" onClick={()=> { setOpenProfile(false); navigate('/profile')}}><FontAwesomeIcon icon={faUser} className="me-2" />Profile</li>
                                        <li className="list-group-item cursor-pointer d-flex align-items-center" onClick={()=> { setOpenProfile(false); navigate('/dashboard')}}><FontAwesomeIcon icon={faGauge} className="me-2" />Dashboard</li>
                                        <li className="list-group-item cursor-pointer d-flex align-items-center" onClick={handleLogout} ><FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Logout</li>
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
