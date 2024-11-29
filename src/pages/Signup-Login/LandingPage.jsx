import React from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';

export default function LandingPage({ setLoginView, setLoading, setShowAlerts, setFormData, formData }) {
    const { postAPI } = useApiService();
    const handleGetOtp = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            mobile_number: values.mobilenumber || null,
            flag: 1
        })
        try {
            const result = await postAPI('/register-user', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                setTimeout(() => {
                    setLoading(false);
                    setFormData({ ...formData, mobile: values.mobilenumber, userExists: responseRs.userExists })
                    if (responseRs.userExists == 1) {
                        setLoginView(3);
                    } else {
                        setLoginView(2);
                    }
                }, 2000);
            }
            else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => {
                    setLoading(false);
                    setShowAlerts(false);
                }, 2000);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const MobileNumberValidationSchema = Yup.object().shape({
        mobilenumber: Yup.string()
            .matches(/^\d{10}$/, 'Must be exactly 10 digits')
            .required('Contact Number is required'),
    });

    return (
        <div className='text-center m-auto text-white pt-4 pb-3'>
            <h2 className='pt-3 fw-bolder'>Blueprint to Completion,</h2>
            <h5 className='p-2 fw-semibold'>Seamless Real Estate Management!</h5>
            <label className='fw-light p-2 pt-4 color-D8DADCE5'>Login or sign up to continue</label>
            <br />
            <div className='pt-2 pb-3'>
                <Formik initialValues={{ mobilenumber: '' }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={MobileNumberValidationSchema}
                    onSubmit={(values) => {
                        handleGetOtp(values);
                    }}>
                    {() => (
                        <Form className='row w-30 m-auto justify-content-center'>
                            <div className='col-md-2 px-0 text-center mb-4'>
                                <Field type="text" className="customInput color-D8DADCE5 phonenumber_first_input" name='onlytext' autoComplete='off' readOnly value="+91" />
                            </div>
                            <div className='col-md-9 text-start position-relative mb-4 px-0'>
                                <label className='custom-label'>Enter mobile number <span className='text-danger'>*</span></label>
                                <Field type="number" className="customInput phonenumber_second_input" name='mobilenumber' autoComplete='off' />
                                <label className='font-12 ps-2 color-D8DADCE5'>(Please use whatsapp number)</label>
                                <ErrorMessage name='mobilenumber' component="div" className="text-start errorText" />
                            </div>
                            <div className='mb-4'>
                                <button type="submit" className='otpBtn'>Proceed</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
