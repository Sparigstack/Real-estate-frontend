import React, { useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import useApiService from '../../services/ApiService';

export default function SignUpLoginPage({ setLoginView }) {
    const { getAPI } = useApiService();
    const [loading, setLoading] = useState(false);
    const handleLoginClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLoginView('enteremail');
        }, 1000);
    }
    return (
        <>
        {loading ? <ShowLoader/> : <HideLoader/>}
            <div className='pt-5 mt-5'>
                <h1 className='fw-bold font-42'>Blueprint to Completion,</h1>
                <h1 className='fw-light font-42 p-2'>Seamless Builders Management..!</h1>
                <p className='fw-light p-2' style={{ fontSize: '18px' }}>Ready to explore</p>
            </div>
            <div className='pt-5 mt-3'>
                <button className='loginBtn' onClick={handleLoginClick}>
                    <FontAwesomeIcon icon={faEnvelope} className='me-3'/>
                    Sign up/ Login with Email
                </button>
            </div>
        </>
    )
}
