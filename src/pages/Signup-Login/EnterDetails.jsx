import React, { useEffect, useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService.js'
const {	postAPI } = useApiService;

export default function EnterDetails({ setLoginView }) {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const handleGetOtp = async () => {
        setLoading(true);
    //     var raw = JSON.stringify({
        
    //     })
    //    const result = await postAPI('', raw);     
        setTimeout(() => {
            setLoading(false);
            setLoginView('enterotp');
        }, 1000);
    }
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])
    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='text-center pt-5 mt-5'>
                <h2 className='fw-normal'>Please Enter Details</h2>
                <div className='mt-2'>
                    <span className='fw-lighter font-16'>We'll sent an email with an activation code to your given email id for verification. So please enter valid email id.</span>
                </div>
                <div className='p-3 mt-2'>
                    <input type="email" className='custom-form-control' placeholder='Enter email id' ref={inputRef} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='mt-3 p-2'>
                    <button className='otpBtn' onClick={handleGetOtp}>GET OTP</button>
                </div>
            </div>
        </>
    )
}

