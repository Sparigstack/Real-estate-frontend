import React, { useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik';
import LoginValidationSchema from '../../utils/validations/LoginValidationSchema.jsx';
import AlertComp from '../../components/alerts/AlertComp.jsx';
import useApiService from '../../hooks/useApiService.jsx';

export default function LoginDetails({ setLoginView, formData, setFormData, setLoading, setShowAlerts }) {
    const { postAPI } = useApiService();

    const handleGetOtp = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            email: values.email,
            username: values?.username
        })
        try {
            const result = await postAPI('/register-user', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                setLoading(false);
                setLoginView(3);
            }
            else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => {
                    setLoading(false);
                    setShowAlerts(<AlertComp show={false} />);
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

            <div className='text-center pt-5'>
                <h2 className='fw-normal'>Please Enter Details</h2>
                <div className='mt-2'>
                    <small className='color-D8DADCE5'>We will send a verification email with a one-time password (OTP) to the address you provide. Please ensure you enter a valid email</small>
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
                                <label className='custom-label'>User Name <span className='text-danger'>*</span></label>
                                <Field type="text" className="customInput" name='username' autoComplete='off' />
                                <ErrorMessage name='username' component="div" className="text-start errorText" />
                            </div>
                            <div className='position-relative mb-4'>
                                <label className='custom-label'>Email <span className='text-danger'>*</span></label>
                                <Field type="email" className="customInput" name='email' autoComplete='off' />
                                <ErrorMessage name='email' component="div" className="text-start errorText" />
                            </div>
                            <div className='mt-4 p-2'>
                                <button type="submit" className='otpBtn'>GET OTP</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

