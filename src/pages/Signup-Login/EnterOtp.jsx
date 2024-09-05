import React, { useEffect, useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';

export default function EnterOtp({ email, setLoginView }) {
    const inputRefs = useRef([]);
    const [otp, setOtp] = useState(Array(5).fill(''));
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);
    const validateOtp = (otpValue) => {
        if (otpValue == '12345') {
            setOtpError('');
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setLoginView('userdetailsform');
            }, 1000);
        }
        else {
            setOtpError('Wrong code, please try again');
        }
    }
    const handleChange = (e, index) => {
        const { value } = e.target;
        const newOtp = [...otp]
        newOtp[index] = value;
        setOtp(newOtp);
        if (value.length == 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
        if (value.length == 0 && index > 0) {
            inputRefs.current[index - 1].focus();
        }
        if (index == inputRefs.current.length - 1) {
            const otpValue = newOtp.join('');
            validateOtp(otpValue);
        }
    }
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [])
    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='text-center pt-5 mt-5'>
                <h2 className='fw-normal'>Please Enter a Code</h2>
                <div className='mt-2'>
                    <span className='fw-light font-16'>We've sent an email with an activation code to your email <br /><b>{email}</b></span>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
                {Array(5).fill().map((_, index) => (
                    <input key={index} type="text" maxLength="1" className={`otpInput mx-2 text-center`} style={{ border: otpError ? '0.5px solid red' : '0.5px solid white' }} ref={(el) => inputRefs.current[index] = el} onChange={(e) => handleChange(e, index)} value={otp[index]} />
                ))}
            </div>
            <div className='text-danger mt-2'>{otpError}</div>
            <div className='text-center mt-3'>
                <span className='fw-lighter font-16'>Don't received code yet? <a className='fw-bold text-decoration-none' href="">Send Again</a></span>
            </div>
        </>
    )
}
