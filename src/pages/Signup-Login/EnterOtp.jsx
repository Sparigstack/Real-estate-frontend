import React, { useEffect, useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function EnterOtp({ email, setLoginView, loginview }) {
    const { postAPI } = useApiService();
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(5).fill(''));
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [timeExpired, setTimeExpired] = useState(false);
    
    const validateOtp = async (otpValue) => {
        // setLoading(true);
        // var raw = JSON.stringify({
        //     email: email,
        //     verification_code: otpValue
        // })
        // try {
        //     const result = await postAPI('/verifyUser', raw);
        //     if (!result || result == "") {
        //         alert('Something went wrong');
        //     }
        //     else {
        //         const responseRs = JSON.parse(result);
        //         if (responseRs.status == 'success') {
        //             Cookies.set('authToken', responseRs.token, {expires : 7});
        //             setOtpError('');
        //             setLoading(false);
        //             setLoginView('userdetailsform');
        //         }
        //         else {
        //             setOtpError(responseRs.msg);
        //         }
        //     }
        // }
        // catch {
        //     console.error(error);
        // }
    if(otpValue == '123456'){
        setOtpError('');
        Cookies.set('authToken', '123456', {expires : 7});
        // setLoginView('userdetailsform');
        navigate('/dashboard');
    }
    else{
        setOtpError('invalid otp');
    }
}
    const handleChangeOtp = (e, index) => {
        const { value } = e.target;
        const newOtp = [...otp];
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

    const handlePasteOtp = (e) => {
        e.preventDefault();
        const pastedOtp = e.clipboardData.getData('text');
        if (pastedOtp.length == inputRefs.current.length) {
            const newOtp = pastedOtp.split('');
            setOtp(newOtp);
            inputRefs.current[inputRefs.current.length - 1].focus();
            const otpValue = newOtp.join('');
            validateOtp(otpValue);
        }
    }

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')} minutes : ${seconds.toString().padStart(2, '0')} seconds`;
    };

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);
    useEffect(() => {
        if(timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1 );
            }, 1000);
            return () => clearInterval(timerId);
        }
        else if (loginview == 'enterotp'){
            setTimeExpired(true);
            setTimeout(() => {
                setTimeExpired(false);
                setLoginView('enteremail');
            }, 1500);
        }
    }, [timeLeft]);

    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='text-center pt-5 mt-5'>
                <h2 className='fw-normal'>Please Enter a Code</h2>
                <div className='mt-2'>
                    <span className='fw-light font-16'>We've sent an email with otp to your email <br /><b>{email}</b></span>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
                {Array(6).fill().map((_, index) => (
                    <input key={index} type="text" maxLength="1" className={`otpInput mx-2 text-center`} style={{ border: otpError ? '0.5px solid red' : '0.5px solid white' }} ref={(el) => inputRefs.current[index] = el} onChange={(e) => handleChangeOtp(e, index)} onPaste={handlePasteOtp} value={otp[index]} disabled={timeExpired}/>
                ))}
            </div>
            <div className='text-danger mt-2'>{otpError}</div>
            {!timeExpired && (
            <div className='text-center mt-3'>
                <span className="font-16 text-danger fw-normal">Time remaining: {formatTime(timeLeft)}</span>
            </div>
            )}
            {timeExpired && (
                <div className='text-danger font-16 fw-normal mt-2'>OTP expired, please request a new code.</div>
            )}
            <div className='text-center mt-3'>
                <span className='fw-lighter font-16'>Don't received code yet? <a className='fw-bold text-decoration-none' href="">Send Again</a></span>
            </div>
        </>
    )
}
