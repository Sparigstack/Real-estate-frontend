import React, { useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik';
import LoginValidationSchema from './LoginValidationSchema.jsx';
import ShowLoader from '../../../components/loader/ShowLoader.jsx';
import HideLoader from '../../../components/loader/HideLoader.jsx';
import useApiService from '../../../services/ApiService.js';
import AlertComp from '../../../components/AlertComp.jsx';

export default function LoginDetails({ setLoginView, formData, setFormData }) {
    const { postAPI } = useApiService();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const handleGetOtp = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            email: values.email,
            username: values?.username
        })
        try {
            const result = await postAPI('/register-user', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setLoading(false);
                    setLoginView(3);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.msg} />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='text-center pt-5'>
                <h2 className='fw-normal'>Please Enter Details</h2>
                <div className='mt-2'>
                    <small className='color-D8DADCE5'>We will send a verification email with a one-time password (OTP) to the address you provide. Please ensure you enter a valid email</small>
                </div>
            </div>
            <div className='p-3 mt-2'>
                <Formik initialValues={formData} validationSchema={LoginValidationSchema}
                    onSubmit={(values) => {
                        setFormData(values);
                        handleGetOtp(values);
                    }}>
                    {() => (
                        <Form>
                            <div className='mb-3'>
                                <Field type="text" className="custom-form-control" name='username' autoComplete='off' placeholder="User Name" />
                                <ErrorMessage name='username' component="div" className="text-danger mt-1 errorText position-relative" />
                            </div>
                            <div className=''>
                                <Field type="email" className="custom-form-control" name='email' autoComplete='off' placeholder="Email" />
                                <ErrorMessage name='email' component="div" className="text-danger mt-1 errorText position-relative" />
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

