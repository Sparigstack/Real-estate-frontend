import { Field, Formik, Form, ErrorMessage } from 'formik'
import React, { useRef, useState } from 'react'
import UserDetailsValidationSchema from '../../utils/validations/UserDetailsValidationSchema'
import HideLoader from '../../components/loader/HideLoader';
import ShowLoader from '../../components/loader/ShowLoader';
import useApiService from '../../services/ApiService';

export default function UserDetailsForm() {
    const logoUploadRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const { postAPI } = useApiService();

    const handleFileChange = (e) => {
        const file = e.target.files[0];

    }

    const handleLogoUpload = () => {
        logoUploadRef.current.click();
    };
    const submitUserDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            username: values.username,
            contactNum: values.contactNum,
            companyName: values.companyName,
            companyEmail: values.companyEmail,
            companyContactNum: values.companyContactNum,
            companyAddress: values.companyAddress,
            companyLogo: values.companyLogo
        })
        try {
            const result = await postAPI('/formsubmit',raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setLoading(false);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.msg} />);
                    setTimeout(() => {
                        setShowAlerts(<AlertComp show={false} />);
                    }, 1500);
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
            <div className="row">
                <div className='col-md-4 offset-md-4'>
                    <div className='border border-2 rounded-3 p-4 mt-3'>
                        <Formik initialValues={{ username: '', contactNum: '', companyName: '', companyEmail: '', companyContactNum: '', companyAddress: '', companyLogo: '' }} validationSchema={UserDetailsValidationSchema} onSubmit={submitUserDetails}>
                            {() => (
                                <Form className='contact-form'>
                                    <div className='mb-4'>
                                        <Field type="text" className="custom-form-control w-100" name='username' autoComplete='off' placeholder="Enter Username" />
                                        <ErrorMessage name='username' component="div" className="text-start mt-1 errorText" />
                                    </div>
                                    <div className='mb-4'>
                                        <Field type="text" className="custom-form-control w-100" name='contactNum' autoComplete='off' placeholder="Enter Contact Number" />
                                        <ErrorMessage name='contactNum' component="div" className="text-start mt-1 errorText" />
                                    </div>
                                    <div className='mb-4'>
                                        <Field type="text" className="custom-form-control w-100" name='companyName' autoComplete='off' placeholder="Enter Company Name" />
                                        <ErrorMessage name='companyName' component="div" className="text-start mt-1 errorText" />
                                    </div>
                                    <div className='mb-4'>
                                        <Field type="text" className="custom-form-control w-100" name='companyEmail' autoComplete='off' placeholder="Enter Company Email" />
                                        <ErrorMessage name='companyEmail' component="div" className="text-start mt-1 errorText" />
                                    </div>
                                    <div className='mb-4'>
                                        <Field type="text" className="custom-form-control w-100" name='companyContactNum' autoComplete='off' placeholder="Enter Company Contact Number" />
                                    </div>
                                    <div className='mb-4'>
                                        <Field type="text" className="custom-form-control w-100" name='companyAddress' autoComplete='off' placeholder="Enter Company Address" />
                                    </div>
                                    <div className='input-group mb-4 cursor-pointer' onClick={handleLogoUpload}>
                                        <Field className="custom-form-control w-75" name='companyLogo' autoComplete='off' readOnly aria-describedby="logo-upload" placeholder="Company Logo" />
                                        <span className="input-group-text" id="logo-upload">Upload</span>
                                        <input
                                            type="file"
                                            ref={logoUploadRef}
                                            className='d-none'
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className='mt-3 p-2'>
                                        <button type="submit" className='otpBtn'>Submit</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    )
}
