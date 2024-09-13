import { Field, Formik, Form, ErrorMessage } from 'formik'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserDetailsValidationSchema from '../../utils/validations/UserDetailsValidationSchema'
import HideLoader from '../../components/loader/HideLoader';
import ShowLoader from '../../components/loader/ShowLoader';
import useApiService from '../../services/ApiService';
import Images from '../../utils/Images';
import { convertToBase64 } from '../../utils/js/Common';
import AlertComp from '../../components/AlertComp';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../context/UserContext';

export default function UserDetailsForm() {
    const logoUploadRef = useRef(null);
    const { postAPI } = useApiService();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const userId = localStorage.getItem('userId');
    const { userDetails, setUserDetails, uploadedFileBase64, setUploadedFileBase64, uploadedFileName, setUploadedFileName } = useContext(UserContext);
    const navigate = useNavigate();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFileName(file.name);
            const base64 = await convertToBase64(file);
            setUploadedFileBase64(base64);
        }
    }
    const handleLogoUpload = () => {
        logoUploadRef.current.click();
    };
    const handleRemoveLogo = () => {
        setUploadedFileBase64(''); 
        setUploadedFileName(''); 
        setUserDetails(prevDetails => ({
            ...prevDetails,
            companyLogo: '' 
        }));
    };
    const submitUserDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            userName: values.username,
            contactNum: values.contactNum,
            companyName: values.companyName,
            companyEmail: values.companyEmail,
            companyContactNum: values.companyContactNum,
            companyAddress: values.companyAddress,
            companyLogo: uploadedFileBase64 || values.companyLogo,
            userId: userId
        })
        try {
            const result = await postAPI('/add-update-user-profile', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setUserDetails(prevDetails => ({
                        ...prevDetails,
                        userName: values.username,
                        contactNum: values.contactNum,
                        companyName: values.companyName,
                        companyEmail: values.companyEmail,
                        companyContactNum: values.companyContactNum,
                        companyAddress: values.companyAddress,
                        companyLogo: uploadedFileBase64 || values.companyLogo
                    }));
                    setShowAlerts(<AlertComp show={true} variant="success" message="Profile updated successfully" />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        navigate('/dashboard');
                    }, 1500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                    setTimeout(() => {
                        setLoading(false);
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
                <div className="row p-4">
                    <div className='col-md-6 offset-md-3'>
                        <h4 className='heading py-4 pt-5'>Contact Details</h4>
                        <Formik initialValues={{ username: userDetails?.userName, contactNum: userDetails?.contactNum, companyName: userDetails?.companyName, companyEmail: userDetails?.companyEmail, companyContactNum: userDetails?.companyContactNum, companyAddress: userDetails?.companyAddress, companyLogo: userDetails?.companyLogo }} validationSchema={UserDetailsValidationSchema} onSubmit={submitUserDetails} enableReinitialize={true} >
                            {() => (
                                <Form className='contact-form'>
                                    <div className="row">
                                        <div className='col-md-6 position-relative mb-5'>
                                            <label className='custom-label'>Username <span className='text-danger'>*</span></label>
                                            <Field type="text" className="customInput" name='username' autoComplete='off' />
                                            <ErrorMessage name='username' component="div" className="text-start mt-1 errorText" />
                                        </div>
                                        <div className='col-md-6 position-relative mb-5'>
                                            <label className='custom-label'>Contact Number <span className='text-danger'>*</span></label>
                                            <span className='countrycode'>+91</span>
                                            <Field type="text" className="customInput" name='contactNum' autoComplete='off' style={{ padding: '1rem 3.1rem' }} />
                                            <ErrorMessage name='contactNum' component="div" className="text-start mt-1 errorText" />
                                        </div>
                                    </div>
                                    <h4 className='heading py-4 pt-2'>Company Details</h4>
                                    <div className="row">
                                        <div className='col-md-6 position-relative mb-5'>
                                            <label className='custom-label'>Company Name <span className='text-danger'>*</span></label>
                                            <Field type="text" className="customInput" name='companyName' autoComplete='off' />
                                            <ErrorMessage name='companyName' component="div" className="text-start mt-1 errorText" />
                                        </div>
                                        <div className='col-md-6 position-relative mb-5'>
                                            <label className='custom-label'>Company Email <span className='text-danger'>*</span></label>
                                            <Field type="text" className="customInput" name='companyEmail' autoComplete='off' />
                                            <ErrorMessage name='companyEmail' component="div" className="text-start mt-1 errorText" />
                                        </div>
                                        <div className='col-md-6 position-relative mb-5'>
                                            <label className='custom-label'>Company Contact Number</label>
                                            <Field type="text" className="customInput" name='companyContactNum' autoComplete='off' />
                                            <ErrorMessage name='companyContactNum' component="div" className="text-start mt-1 errorText" />
                                        </div>
                                        <div className='col-md-6 position-relative mb-5'>
                                            <label className='custom-label'>Company Address</label>
                                            <Field type="text" className="customInput" name='companyAddress' autoComplete='off' />
                                        </div>
                                    </div>
                                    <div className='input-group mb-4 cursor-pointer' onClick={handleLogoUpload}>
                                        <label className='custom-label'>Company Logo</label>
                                        <Field className="customInput" name='companyLogo' autoComplete='off' readOnly aria-describedby="logo-upload" style={{ width: '86%', borderRight:'none' }} value={uploadedFileName} />
                                        <span className="input-group-text" id="logo-upload">Upload</span>
                                        <input type="file" ref={logoUploadRef} className='d-none' onChange={handleFileChange} accept="image/*"
                                        />
                                    </div>
                                    {uploadedFileBase64 || userDetails.companyLogo ? (
                                        <div className='mb-4 position-relative'>
                                            <img src={uploadedFileBase64 || userDetails.companyLogo} alt="Company Logo" style={{ maxWidth: '150px', maxHeight: '150px', border: '2px solid white', padding: '10px' }}/>
                                            <FontAwesomeIcon icon={faTimes} onClick={handleRemoveLogo} className='close-icon' />
                                        </div>
                                    ) : null}
                                    <div className='mt-1 text-end'>
                                        <button type="submit" className='otpBtn'>Submit</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
        </>
    )
}
