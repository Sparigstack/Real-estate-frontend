import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function LandingPage({ setLoginView, setLoading }) {
    const handleLoginClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLoginView(2);
        }, 1500);
    }
    return (
        <div className='text-center text-white pt-5'>
            <h2 className='pt-3 fw-bolder'>Blueprint to Completion,</h2>
            <h2 className='p-2'>Seamless Builders Management..!</h2>
            <label className='fw-light p-2'>Ready to explore</label>
            <div className='pt-4 pb-5'>
                <button className='loginBtn' onClick={handleLoginClick}>
                    <FontAwesomeIcon icon={faEnvelope} className='me-3' />
                    Sign up/ Login with Email
                </button>
            </div>
        </div>
    )
}
