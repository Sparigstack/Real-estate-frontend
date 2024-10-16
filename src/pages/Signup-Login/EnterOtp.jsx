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
    const [timeLeft, setTimeLeft] = useState(180);
    const [timeExpired, setTimeExpired] = useState(false);
    const navigate = useNavigate();
    const alertTimeoutRef = useRef();
    const { setAuthToken, setUserId } = useAuth();

    const validateOtp = async (otpValue) => {
        setLoading(true);
        var raw = JSON.stringify({
            email: formData.email,
            otp: otpValue
        })
        try {
            const result = await postAPI('/check-user-otp', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                Cookies.set('authToken', responseRs.token, { expires: 1, secure: true, sameSite: 'Strict' });
                Cookies.set('userId', responseRs.userId, { expires: 1, secure: true, sameSite: 'Strict' });
                setOtpError('');
                showAlert('User logged in successfully', 'success');
                setTimeout(() => {
                    setAuthToken(responseRs.token)
                    setUserId(responseRs.userId)
                    setLoading(false);
                    setShowAlerts(<AlertComp show={false} />);
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
            setShowAlerts(<AlertComp show={false} />);
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
            username: formData.username,
            email: formData.email
        })
        try {
            const result = await postAPI('/register-user', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                setLoading(false);
                setTimeLeft(180);
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
                    setShowAlerts(<AlertComp show={false} />);
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
                <h2 className='fw-normal'>Please Enter a Code</h2>
                <div className='mt-2'>
                    <small className='color-D8DADCE5'>We've sent an email with otp to your email <br /><b>{formData.email}</b></small>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
                {Array(6).fill().map((_, index) => (
                    <input key={index} type="text" maxLength="1" className={`otpInput mx-2 text-center`} style={{ border: otpError || timeExpired ? '0.5px solid red' : '0.5px solid white' }} ref={(el) => inputRefs.current[index] = el} onChange={(e) => handleChangeOtp(e, index)} onPaste={handlePasteOtp} value={otp[index]} />
                ))}
            </div>
            <div className='text-danger mt-2'>{otpError}</div>
            {!timeExpired && (
                <div className='text-center mt-2'>
                    <span className="font-16 text-danger fw-normal">{formatTime(timeLeft)}</span>
                </div>
            )}
            {timeExpired && (
                <div className='text-center mt-3'>
                    <span className='fw-light text-danger font-16'>Otp is expired. <a className='fw-bold text-decoration-none cursor-pointer' onClick={handleResendOtp}>Resend Code</a></span>
                </div>
            )}
            {!timeExpired && (
                <div className='text-center mt-3 mb-4'>
                    <span className='fw-light font-16'>Don't received code yet? <a className='fw-bold text-decoration-none cursor-pointer' onClick={handleResendOtp}>Resend Code</a></span>
                </div>
            )}
        </>
    )
}
