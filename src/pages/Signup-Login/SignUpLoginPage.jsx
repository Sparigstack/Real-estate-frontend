import React, { useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Images from '../../utils/Images';

export default function SignUpLoginPage({ setLoginView }) {
    const [loading, setLoading] = useState(false);
    const handleLoginClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLoginView(2);
        }, 1000);
    }
    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className="loginLayout" >
                <div className='text-center text-white pt-5'>
                    <img src={Images.realEstateLogo} alt="realestatelogo" className='' />
                    <div className='mt-5'>
                        <h2 className='pt-3 fw-bolder'>Blueprint to Completion,</h2>
                        <h2 className='p-2'>Seamless Builders Management..!</h2>
                        <label className='fw-light p-2'>Ready to explore</label>
                    </div>
                    <div className='pt-4'>
                        <button className='loginBtn' onClick={handleLoginClick}>
                            <FontAwesomeIcon icon={faEnvelope} className='me-3' />
                            Sign up/ Login with Email
                        </button>
                    </div>
                    <div className='col-12 pt-5'>
                        <small className='color-D8DADCE5 pt-5'>By signing in, you agree to our Terms of Service and acknowledge that our Privacy Policy applies to you.</small>
                    </div>
                </div>
            </div>
        </>
    )
}
