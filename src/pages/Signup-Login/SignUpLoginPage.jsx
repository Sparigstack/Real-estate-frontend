import React, { useState } from 'react'
import Images from '../../utils/Images'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';

export default function SignUpLoginPage({ setLoginView }) {
    const [loading, setLoading] = useState(false);
    const handleLoginClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLoginView('phonenumber');
        }, 1000);
    }
    return (
        <>
        {loading ? <ShowLoader/> : <HideLoader/>}
            <div className='pt-5 mt-5'>
                <h1 className='fw-bold font-42'>Blueprint to Completion,</h1>
                <h1 className='fw-light font-42 p-2'>Seamless Builders Management..!</h1>
                <p className='fw-lighter p-2' style={{ fontSize: '18px' }}>Ready to explore</p>
            </div>
            <div className='pt-5 mt-5'>
                <button className='loginBtn' onClick={handleLoginClick}>
                    <img src={Images.phone} alt="phone" className='me-3' />
                    Sign up/ Login with Email
                </button>
            </div>
        </>
    )
}
