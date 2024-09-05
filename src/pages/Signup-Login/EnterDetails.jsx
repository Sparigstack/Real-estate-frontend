import React, { useEffect, useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService.js'
import { Field, Formik, Form, ErrorMessage } from 'formik';
import EmailValidationSchema from '../../utils/validations/EmailValidationSchema.js';
const { postAPI } = useApiService;

export default function EnterDetails({ setLoginView, setEmail }) {
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const handleGetOtp = async (values) => {
        const email = values?.email;
        setLoading(true);
        // var raw = JSON.stringify({

        // })
        // try {
        //     const result = await postAPI('', raw);
        //     if (!result || result == "") {
        //         alert('Something went wrong');
        //     } else {
        //         const responseRs = JSON.parse(result);
        //         setTimeout(() => {
        //             setLoading(false);
        //             setLoginView('enterotp');
        //         }, 1000);
        //     }
        // }
        // catch (error) {
        //     console.error(error);
        // }
        setTimeout(() => {
            setLoading(false);
            setEmail(email);
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
                <h2 className='fw-normal'>Please Enter Email</h2>
                <div className='mt-2'>
                    <span className='fw-light font-16'>We'll sent an email with an activation code to your given email for verification. So please enter valid email.</span>
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

