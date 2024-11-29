import React, { useState } from 'react'
import Images from '../../utils/Images'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';
import AddPropertyForm from './AddPropertyForm';

export default function AddProperty() {
    const navigate = useNavigate();
    const [formview, setFormView] = useState(1);
    const [propertyType, setPropertyType] = useState(0);
    const { logout } = useAuth();
    const location = useLocation();
    const showbackbutton = location.state && location.state.ShowBack;
    return (
        <>
            {formview == 1 ?
                <div className="content-area h-100vh">
                    <div className='text-center text-white'>
                        <div className='col-12 justify-content-end align-items-center d-flex cursor-pointer'>
                            {showbackbutton && (
                                <label className='fontwhite font-18 cursor-pointer' onClick={(e) => navigate("/schemes")}>Back to Scheme</label>
                            )}
                            <FontAwesomeIcon icon={faRightFromBracket} className='logout-icon ms-3' onClick={logout} />
                        </div>
                        <div className="d-flex pt-3 align-items-center justify-content-center position-relative">
                            <img src={Images.realEstateLogo} alt="realestatelogo" className='logosize' />
                        </div>
                        <div className='loginContent'>
                            <div className="text-center p-4">
                                <h4 className='heading pt-4 '>Add Your First Project</h4>
                                <p className='font-16 mb-1 text-white fw-normal'>Adding your project is quick and easy in SuperBuildup. It is an entry point to start your journey with us. <span className='fw-bold'>Let's Start</span></p>
                                <p className='font-16 text-white fw-normal'>Managing one project is 100% free on SuperBuildup. </p>
                                <h6 className='pt-4 text-white fw-semibold'>What type of project do you want to manage?</h6>
                                <div className='text-center d-flex justify-content-center gap-3 pt-3'>
                                    <div className='propertiesOptions cursor-pointer' onClick={(e) => { setPropertyType(1); setFormView(2) }}>
                                        <img src={Images.commercial} alt="commercial" style={{ height: '30px' }} />
                                        <br />
                                        Commercial
                                    </div>
                                    <div className='propertiesOptions cursor-pointer' onClick={(e) => { setPropertyType(2); setFormView(2) }}>
                                        <img src={Images.residential} alt="residential" style={{ height: '30px' }} />
                                        <br />
                                        Residential
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                :
                <AddPropertyForm schemeType={propertyType} setFormView={setFormView} />
            }
        </>
    )
}
