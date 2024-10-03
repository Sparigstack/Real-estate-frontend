import React, { useContext, useEffect, useRef, useState } from 'react'
import PropertiesValidationSchema from '../../utils/validations/PropertiesValidationSchema';
import { Field, Formik, Form, ErrorMessage } from 'formik'
import useApiService from '../../services/ApiService';
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import Cookies from 'js-cookie';
import AlertComp from '../../components/AlertComp';
import { useNavigate, useParams } from 'react-router-dom';
import { convertToBase64 } from '../../utils/js/Common';
import { UserContext } from '../../context/UserContext';

export default function AddPropertyForm() {
    var { schemeType } = useParams();
    const { getAPI, postAPI } = useApiService();
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const logoUploadRef = useRef(null);
    const [filedetails, setfileDetails] = useState({
        uploadedFileName: '',
        uploadedFileBase64: ''
    })
    const [commercialDetails, setCommercialDetails] = useState({
        propertyname: '',
        reraregisterednumber: '',
        propertysubtype: '',
        address: '',
        pincode: '',
        numberofWings: '',
        description: '',
    });
    const [selectedPropertySubType, setSelectedPropertySubType] = useState(null);
    const [propertyTypeArray, setpropertyTypeArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    useEffect(() => {
        const getPropertyTypes = async () => {
            try {
                const result = await getAPI(`/get-property-types/${schemeType}`, 3);
                if (!result || result == "") {
                    alert('Something went wrong');
                }
                else {
                    const responseRs = JSON.parse(result);
                    setpropertyTypeArray(responseRs?.sub_properties)
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        getPropertyTypes();
    }, []);
    const submitCommercialDetails = async (values) => {
        setLoading(true);
        console.log("hi")
        var raw = JSON.stringify({
            name: values?.propertyname,
            reraRegisteredNumber: values?.reraregisterednumber || null,
            propertyTypeFlag: schemeType,
            propertySubTypeFlag: selectedPropertySubType,
            address: values?.address,
            description: values?.description ? values?.description : null,
            userId: userId,
            pincode: values?.pincode,
            property_img: filedetails?.uploadedFileBase64
        })
        console.log(raw)
        try {
            const result = await postAPI('/add-property-details', raw, 3);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    Cookies.set('propertyId', responseRs.propertyId, { expires: 1, secure: true, sameSite: 'Strict' });
                    setShowAlerts(<AlertComp show={true} variant="success" message="Property Added Successfully." />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        navigate("/dashboard");
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.msg} />);
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
    const handleLogoUpload = () => {
        logoUploadRef.current.click();
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setfileDetails({ ...filedetails, uploadedFileName: file.name, uploadedFileBase64: base64 })
        }
    }
    return (
        <div className='content-area h-100vh scrollable-content'>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className="row p-4 ">
                <div className='col-md-8 offset-md-2'>
                    <h4 className='heading'>{schemeType == 1 ? 'Commercial!' : 'Residentials!'}</h4>
                    <p className='font-16 text-white fw-normal'>Heyy, please fill all the informations to proceed further.</p>
                    <Formik initialValues={commercialDetails}
                        validationSchema={PropertiesValidationSchema}
                        onSubmit={(values) => {
                            setCommercialDetails(values);
                            submitCommercialDetails(values);
                        }}>
                        {({ setFieldValue }) => (
                            <Form className='pt-4 mt-2 property-form' >
                                <div className="row">
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Name on Property <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='propertyname' autoComplete='off' />
                                        <ErrorMessage name='propertyname' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Rera registered number</label>
                                        <Field type="text" className="customInput" name='reraregisterednumber' autoComplete='off' />
                                    </div>
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Pincode <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='pincode' autoComplete='off' />
                                        <ErrorMessage name='pincode' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative d-flex mb-4'>
                                        <label className='custom-label'>Property Image</label>
                                        <Field className="customInput" name='companyLogo' autoComplete='off' readOnly aria-describedby="logo-upload" value={filedetails.uploadedFileName}
                                            style={{ borderTopRightRadius: "0px", borderBottomRightRadius: "0px" }} />
                                        <button className="input-group-text" id="logo-upload" onClick={handleLogoUpload}>Upload</button>
                                        <input type="file" ref={logoUploadRef} className='d-none' onChange={handleFileChange} accept="image/*"
                                        />
                                    </div>
                                </div>
                                <div className='position-relative mb-4'>
                                    <div className="d-flex flex-wrap align-items-center" style={{ gap: '10px' }}>
                                        <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Property Type <span className='text-danger'>*</span></label>
                                        {propertyTypeArray?.map((subProperty) => (
                                            <div key={subProperty.id} className={`${selectedPropertySubType == subProperty.id ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} 
                                            cursor-pointer`} onClick={() => { setSelectedPropertySubType(subProperty.id); setFieldValue('propertysubtype', subProperty?.id) }}>
                                                {subProperty.name}
                                            </div>
                                        ))}
                                    </div>
                                    <Field type="hidden" name="propertysubtype" value={selectedPropertySubType} />
                                    <ErrorMessage name="propertysubtype" component="div" className="text-start errorText" />
                                </div>
                                <div className="row">
                                    <div className='col-md-6 position-relative mb-3'>
                                        <label className='custom-label'>Address <span className='text-danger'>*</span></label>
                                        <Field as="textarea" className="customInput" name='address' autoComplete='off' rows="4" />
                                        <ErrorMessage name='address' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-3'>
                                        <label className='custom-label'>Property Description</label>
                                        <Field as="textarea" className="customInput" name='description' autoComplete='off' rows="4" />
                                    </div>
                                </div>
                                <div className='text-end'>
                                    <button type="button" className='cancelBtn me-2' onClick={(e) => navigate('/add-property-scheme')}>Cancel</button>
                                    <button type="submit" className='otpBtn'>Continue</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}
