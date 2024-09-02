import React, { useEffect, useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';

export default function EnterDetails({ setLoginView }) {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const handleGetOtp = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setLoginView('enterotp');
        }, 1500);
    }
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])
    return (
        <>
        {loading ? <ShowLoader/> : <HideLoader/>}
            <div className='text-center pt-5 mt-5'>
                <h2 className='fw-normal'>Please Enter Details</h2>
                <div className='mt-2'>
                    <span className='fw-lighter font-16'>We'll sent an SMS with an activation code to your given phone number for verification.</span>
                </div>
                <div className='p-3 mt-2'>
                    <input type="text" className='custom-form-control' placeholder='Enter Username' ref={inputRef} />
                </div>
                <div className='p-3 mt-2 position-relative'>
                    <span className='countrycode'>+91</span>
                    <input type="text" className='custom-form-control' style={{ paddingLeft: '50px' }} />
                </div>
                <div className='d-flex align-items-center justify-content-center mt-3'>
                    <div className="form-check me-4 custom-radio d-flex align-items-center">
                        <input className="form-check-input me-2" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                        <label className="form-check-label font-16 fw-light" htmlFor="flexRadioDefault1">
                            What's App
                        </label>
                    </div>
                    <div className="form-check custom-radio d-flex align-items-center">
                        <input className="form-check-input me-2" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                        <label className="form-check-label font-16 fw-light" htmlFor="flexRadioDefault2">
                            SMS
                        </label>
                    </div>
                </div>
                <div className='mt-3 p-2'>
                    <button className='otpBtn' onClick={handleGetOtp}>GET OTP</button>
                </div>
            </div>
        </>
    )
}

