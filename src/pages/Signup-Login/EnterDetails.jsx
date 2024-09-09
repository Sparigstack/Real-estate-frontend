import React, { useEffect, useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService.js'
import { Field, Formik, Form, ErrorMessage } from 'formik';
import EmailValidationSchema from '../../utils/validations/EmailValidationSchema.js';
import AlertComp from '../../components/AlertComp.jsx';

export default function EnterDetails({ setLoginView, setEmail }) {
    const { postAPI } = useApiService();
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);

    const handleGetOtp = async (values) => {
        const email = values?.email;
        setLoading(true);
        var raw = JSON.stringify({
            email: email
        })
        try {
            const result = await postAPI('/RegisterUser', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if(responseRs.status == 'success') {
                    setLoading(false);
                    setEmail(email);
                    setLoginView('enterotp');
                }
                else{
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.msg}/>);
                    setTimeout(() => {
                        setShowAlerts(<AlertComp show={false} />);
                    }, 1500);                                                
                }                
            }
        }
        catch (error) {
            console.error(error);
        }
        // setTimeout(() => {
        //     setLoading(false);
        //     setShowAlerts(<AlertComp show={true} variant="success" message="Otp sent successfully" />);
        //     setTimeout(() => {
        //         setShowAlerts(<AlertComp show={false} />)
        //         setEmail(email);
        //         setLoginView('enterotp');
        //     }, 1500);
        // }, 1500);
    }
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])
    return (
        <>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='text-center pt-5 mt-5'>
                <h2 className='fw-normal'>Please Enter Email</h2>
                <div className='mt-2'>
                    <span className='fw-light font-16'>We'll sent an email with otp to your given email for verification. So please enter valid email.</span>
                </div>
            </div>
            <div className='p-3 mt-2'>
                <Formik initialValues={{ email: '' }} validationSchema={EmailValidationSchema} onSubmit={handleGetOtp}>
                    {() => (
                        <Form>
                            <div className='mb-5 position-relative'>
                                <Field type="text" className="custom-form-control" name='email' autoComplete='off' innerRef={inputRef} />
                                <ErrorMessage name='email' component="div" className="text-danger mt-1 errorText" />
                            </div>
                            <div className='mt-3 p-2'>
                                <button type="submit" className='otpBtn'>GET OTP</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

