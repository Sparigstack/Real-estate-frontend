import React, { useEffect, useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import AlertComp from '../../components/AlertComp';

export default function EnterOtp({ formData }) {
    const { postAPI } = useApiService();
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [timeExpired, setTimeExpired] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);

    const validateOtp = async (otpValue) => {
        setLoading(true);
        var raw = JSON.stringify({
            email: formData.email,
            otp: otpValue
        })
        try {
            const result = await postAPI('/check-user-otp', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    Cookies.set('authToken', responseRs.token, { expires: 1 });
                    Cookies.set('userId', responseRs.userId, { expires: 1 });
                    setOtpError('');
                    setShowAlerts(<AlertComp show={true} variant="success" message="User logged in successfully" />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        window.location.href = '/dashboard';
                    }, 2000);
                }
                else {
                    setOtpError(responseRs.msg);
                    setLoading(false);
                }
            }
        }
        catch {
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
        return `${minutes.toString().padStart(2, '0')}  : ${seconds.toString().padStart(2, '0')} `;
    };

    const handleResendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        var raw = JSON.stringify({
            username : formData.username, 
            email: formData.email
        })
        try {
            const result = await postAPI('/register-user', raw);
            if (!result || result == '') {
                alert('Something went wrong');
            }
            else {
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
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.msg} />);
                    setTimeout(() => {
                        setShowAlerts(<AlertComp show={false} />);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
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
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
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
