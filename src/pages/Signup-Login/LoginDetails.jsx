import React, { useEffect, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik';
import LoginValidationSchema from '../../utils/validations/LoginValidationSchema.jsx';
import AlertComp from '../../components/alerts/AlertComp.jsx';
import useApiService from '../../hooks/useApiService.jsx';
import { formatTime } from '../../utils/js/Common.js';
import Cookies from 'js-cookie';
import useAuth from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

export default function LoginDetails({ formData, setFormData, setLoading, setShowAlerts }) {
    const { postAPI } = useApiService();
    const [timeLeft, setTimeLeft] = useState(120);
    const [timeExpired, setTimeExpired] = useState(false);
    const [otpError, setOtpError] = useState('');
    const { setAuthToken, setUserId } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (timeExpired) {
            setFormData({ ...formData, otp: '' });
            setOtpError('');
        }
    }, [timeExpired])

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

    const handleGetOtp = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            mobile_number: formData.mobile,
            otp: values.otp,
            flag: formData.userExists,
            company_name: values.companyname,
            user_name: values.username
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
                setShowAlerts(<AlertComp show={true} variant="success" message={"User logged in successfully"} />);
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
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

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
                setFormData({ ...formData, otp: '' });
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

    return (
        <>
            <div className='text-center pt-4'>
                <h2 className='fw-normal'>Please Enter Details</h2>
                <div className='mt-2'>
                    <small className='color-D8DADCE5'>We have sent One Time Password (OTP) via whatsapp to the number you have provided.</small>
                </div>
            </div>
            <div className='p-3 mt-2'>
                <Formik initialValues={formData}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={LoginValidationSchema}
                    onSubmit={(values) => {
                        setFormData(values);
                        handleGetOtp(values);
                    }}>
                    {() => (
                        <Form className='w-25 d-inline-block justify-content-center'>
                            <div className='position-relative mb-4'>
                                <label className='custom-label'>Your Name <span className='text-danger'>*</span></label>
                                <Field type="text" className="customInput" name='username' autoComplete='off' />
                                <ErrorMessage name='username' component="div" className="text-start errorText" />
                            </div>
                            <div className='position-relative mb-4'>
                                <label className='custom-label'>Company Name <span className='text-danger'>*</span></label>
                                <Field type="text" className="customInput" name='companyname' autoComplete='off' />
                                <ErrorMessage name='companyname' component="div" className="text-start errorText" />
                            </div>
                            <div className='position-relative mb-4'>
                                <label className='custom-label'>Enter Otp <span className='text-danger'>*</span></label>
                                <Field type="text" className="customInput" name='otp' autoComplete='off' />
                                <ErrorMessage name='otp' component="div" className="text-start errorText" />
                            </div>
                            {otpError && (
                                <>
                                    <span className='fw-light text-danger font-16'>{otpError}</span>
                                    <div className='text-center mt-3 mb-5'>
                                        <a className='fw-bold fontwhite text-decoration-none cursor-pointer' onClick={handleResendOtp}>Resend OTP</a>
                                    </div>
                                </>
                            )}
                            {!timeExpired ?
                                <span className='fw-lightcolor-D8DADCE5 font-16'>Resend OTP in {formatTime(timeLeft)}</span>
                                :
                                <div className='text-center mt-3 mb-5'>
                                    <a className='fw-bold fontwhite text-decoration-none cursor-pointer' onClick={handleResendOtp}>Resend OTP</a>
                                </div>
                            }
                            <div className='mt-4 mb-4 p-2'>
                                <button type="submit" className='otpBtn'>Sign Up</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

