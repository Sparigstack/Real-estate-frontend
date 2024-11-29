import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import AlertComp from '../../components/alerts/AlertComp';
import useApiService from '../../hooks/useApiService';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function EnterOtp({ formData, setLoading, setShowAlerts }) {
    const { postAPI } = useApiService();
    const inputRefs = useRef([]);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [otpError, setOtpError] = useState('');
    const [timeLeft, setTimeLeft] = useState(120);
    const [timeExpired, setTimeExpired] = useState(false);
    const navigate = useNavigate();
    const alertTimeoutRef = useRef();
    const { setAuthToken, setUserId } = useAuth();

    const validateOtp = async (otpValue) => {
        setLoading(true);
        var raw = JSON.stringify({
            mobile_number: formData.mobile,
            otp: otpValue,
            flag: formData.userExists,
            company_name: null,
            user_name: null
        })
        try {
            const result = await postAPI('/check-user-otp', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                Cookies.set('authToken', responseRs.token, { expires: 1 });
                Cookies.set('userId', responseRs.userId, { expires: 1 });
                setOtpError('');
                showAlert('User logged in successfully', 'success');
                setTimeout(() => {
                    setAuthToken(responseRs.token)
                    setUserId(responseRs.userId)
                    setLoading(false);
                    setShowAlerts(false);
                    if (responseRs.userProperty == 1) {
                        navigate('/schemes');
                    } else {
                        navigate('/add-scheme');
                    }
                }, 2000);
            }
            else {
                setOtpError(responseRs.message);
                setLoading(false);
            }
        }
        catch {
            setLoading(false);
            console.error(error);
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
        else if (value.length == 0 && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (newOtp.every(digit => digit)) {
            validateOtp(newOtp.join(''));
        }

    }

    const handlePasteOtp = (e) => {
        e.preventDefault();
        const pastedOtp = e.clipboardData.getData('text');
        if (pastedOtp.length == inputRefs.current.length) {
            const newOtp = pastedOtp.split('');
            setOtp(newOtp);
            validateOtp(newOtp.join(''));
        }
    }
    const showAlert = (message, variant = 'success') => {
        setShowAlerts(<AlertComp show={true} variant={variant} message={message} />);
        alertTimeoutRef.current = setTimeout(() => {
            setShowAlerts(false);
        }, 2000);
    };
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}  : ${seconds.toString().padStart(2, '0')} `;
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        var raw = JSON.stringify({
            mobile_number: formData.mobile,
            flag: 2
        })
        try {
            const result = await postAPI('/register-user', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                setLoading(false);
                setTimeLeft(120);
                setTimeExpired(false);
                setOtpError('')
                setOtp(Array(6).fill(''));
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }
            else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => {
                    setShowAlerts(false);
                }, 2000);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    useEffect(() => {
        return () => {
            if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        };
    }, []);
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
        else {
            setTimeExpired(true);
        }
    }, [timeLeft]);

    useEffect(() => {
        if (timeExpired) {
            setOtp(Array(6).fill(''));
            setOtpError('');
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }
    }, [timeExpired])

    return (
        <>
            <div className='text-center pt-5'>
                <h2 className='fw-normal'>Please Enter OTP</h2>
                <div className='mt-2'>
                    <small className='color-D8DADCE5'>We've sent an otp to your mobile number <br /><b>+91 {formData.mobile}</b></small>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
                {Array(6).fill().map((_, index) => (
                    <input key={index} type="text" maxLength="1" className={`otpInput mx-2 text-center`} style={{ border: otpError || timeExpired ? '0.5px solid red' : '0.5px solid white' }} ref={(el) => inputRefs.current[index] = el} onChange={(e) => handleChangeOtp(e, index)} onPaste={handlePasteOtp} value={otp[index]} />
                ))}
            </div>
            {otpError ?
                <>
                    <div className='text-danger mt-2'>{otpError}</div>
                    <div className='text-center mt-3 mb-5'>
                        <a className='fw-bold fontwhite text-decoration-none cursor-pointer' onClick={handleResendOtp}>Resend OTP</a>
                    </div>
                </>
                :
                timeExpired ?
                    <div className='text-center mt-3 mb-5'>
                        <a className='fw-bold fontwhite text-decoration-none cursor-pointer' onClick={handleResendOtp}>Resend OTP</a>
                    </div>
                    :
                    <div className='text-center mt-4 mb-5'>
                        <span className="font-16 color-D8DADCE5 fw-normal">Resend OTP in <b>{formatTime(timeLeft)}</b></span>
                    </div>
            }

        </>
    )
}
