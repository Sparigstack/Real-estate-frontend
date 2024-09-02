import React, { useEffect, useRef } from 'react'

export default function EnterOtp() {
    const inputRefs = useRef([]);
    const handleChange = (e, index) => {
        const { value } = e.target;
        if (value.length == 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
        if (value.length == 0 && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [])
    return (
        <div>
            <div className='text-center pt-5 mt-5'>
                <h2 className='fw-normal'>Please Enter a Code</h2>
                <div className='mt-2'>
                    <span className='fw-lighter font-16'>We've sent an SMS with an activation code to your phone +91 9294278411</span>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
                {Array(5).fill().map((_, index) => (
                    <input key={index} type="text" maxLength="1" className="otpInput mx-2 text-center" ref={(el) => inputRefs.current[index] = el} onChange={(e) => handleChange(e, index)} />
                ))}
            </div>
            <div className='text-center mt-3'>
                <span className='fw-lighter font-16'>Don't received code yet? <a className='fw-bold text-decoration-none' href="">Send Again</a></span>
            </div>
        </div>
    )
}
