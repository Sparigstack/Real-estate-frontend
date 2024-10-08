import React, { useState } from 'react'
import Images from '../../utils/Images'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import ShowLoader from '../../components/loader/ShowLoader';
import useAuth from '../../hooks/useAuth';

export default function AddProperty() {
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();
    const showbackbutton = location.state && location.state.ShowBack;
    return (
        <div className="content-area h-100vh">
            {loading && <ShowLoader />}
            <div className='text-center text-white'>

                <div className='col-12 justify-content-end align-items-center d-flex cursor-pointer'>
                    {showbackbutton && (
                        <label className='fontwhite font-18 cursor-pointer' onClick={(e) => navigate("/properties")}>Back to Properties</label>
                    )}
                    <FontAwesomeIcon icon={faRightFromBracket} className='logout-icon ms-3' onClick={logout} />
                </div>
                <div className="d-flex pt-5 align-items-center justify-content-center position-relative">
                    <img src={Images.realEstateLogo} alt="realestatelogo" className='' />
                </div>
                <div className='loginContent'>
                    <div className="text-center p-4">
                        <h4 className='heading pt-4'>Add Property !</h4>
                        <p className='font-16 text-white fw-normal'>It will only take 5 minutes to add property details. <span className='fw-bold'>Let's Start</span></p>
                        <h5 className='pt-3 text-white fw-semibold'>Choose your Scheme type?</h5>
                        <div className='text-center d-flex justify-content-center gap-3 pt-3'>
                            <div className='propertiesOptions cursor-pointer' onClick={(e) => navigate('/add-property-form/1')}>
                                <img src={Images.commercial} alt="commercial" style={{ height: '30px' }} />
                                <br />
                                Commercial
                            </div>
                            <div className='propertiesOptions cursor-pointer' onClick={(e) => navigate('/add-property-form/2')}>
                                <img src={Images.residential} alt="residential" style={{ height: '30px' }} />
                                <br />
                                Residential
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
