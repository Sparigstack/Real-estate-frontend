import React, { useEffect, useRef, useState } from 'react'
import PropertiesValidationSchema from '../../utils/validations/PropertiesValidationSchema';
import { Field, Formik, Form, ErrorMessage } from 'formik'
import Cookies from 'js-cookie';
import AlertComp from '../../components/alerts/AlertComp';
import { useNavigate } from 'react-router-dom';
import { convertToBase64 } from '../../utils/js/Common';
import Images from '../../utils/Images';
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';
import useCommonApiService from '../../hooks/useCommonApiService';
import Loader from '../../components/loader/Loader';

export default function AddPropertyForm({ schemeType, setFormView }) {
    const { switchProperty } = useProperty();
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const logoUploadRef = useRef(null);
    const { getAllStates, getCities } = useCommonApiService();
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
        state: 0,
        city: 0,
        area: ''
    });
    const [selectedPropertySubType, setSelectedPropertySubType] = useState(null);
    const [propertyTypeArray, setpropertyTypeArray] = useState([]);
    const [StateArray, setStateArray] = useState([]);
    const [CityArray, setCityArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    useEffect(() => {
        const getPropertyTypes = async () => {
            try {
                const result = await getAPIAuthKey(`/get-property-types/${schemeType}`);
                if (!result || result == "") {
                    alert('Something went wrong');
                }
                else {
                    const responseRs = JSON.parse(result);
                    setpropertyTypeArray(responseRs?.sub_properties)
                }

                var states = await getAllStates();
                if (states) {
                    setStateArray(states);  // Set the fetched states in state
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
        var raw = JSON.stringify({
            name: values?.propertyname,
            reraRegisteredNumber: values?.reraregisterednumber || null,
            propertyTypeFlag: schemeType,
            propertySubTypeFlag: selectedPropertySubType,
            address: values?.address,
            description: values?.description ? values?.description : null,
            userId: userId,
            pincode: values?.pincode,
            property_img: filedetails?.uploadedFileBase64 || null,
            state: values?.state,
            city: values?.city,
            area: values?.area
        })
        try {
            const result = await postAPIAuthKey('/add-property-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    Cookies.set('schemeId', responseRs.propertyId, { expires: 1, secure: true, sameSite: 'Strict' });
                    setShowAlerts(<AlertComp show={true} variant="success" message="Scheme Added Successfully." />);
                    await switchProperty(responseRs.propertyId);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        navigate("/dashboard");
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
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
    const GetCities = async (stateid) => {
        var cities = await getCities(stateid);
        if (cities) {
            setCityArray(cities)
        }
    }
    return (
        <div className='h-100vh content-area'>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='col-md-10 offset-md-1 p-2'>
                <div className='row align-items-center'>
                    <div className='col-1'>
                        <img src={Images.backArrow} alt="back-arrow" style={{ height: "40px" }}
                            className='cursor-pointer' onClick={() => setFormView(1)} />
                    </div>
                    <div className='col-11'>
                        <h4 className='heading mb-0'>{schemeType == 1 ? 'Commercial!' : 'Residentials!'}</h4>
                        <p className='font-16 text-white fw-normal'>Heyy, please fill all the informations to proceed further.</p>
                    </div>
                </div>
                <Formik initialValues={commercialDetails}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={PropertiesValidationSchema}
                    onSubmit={(values) => {
                        setCommercialDetails(values);
                        submitCommercialDetails(values);
                    }}>
                    {({ setFieldValue }) => (
                        <Form className='pt-4 mt-2 property-form' >
                            <div className="row">
                                <div className='col-md-6 position-relative mb-4'>
                                    <label className='custom-label'>Name on Scheme <span className='text-danger'>*</span></label>
                                    <Field type="text" className="customInput" name='propertyname' autoComplete='off' />
                                    <ErrorMessage name='propertyname' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 position-relative mb-4'>
                                    <label className='custom-label'>Rera registered number</label>
                                    <Field type="text" className="customInput" name='reraregisterednumber' autoComplete='off' />
                                </div>
                                <div className='col-md-3 position-relative mb-4'>
                                    <label className='custom-label'>Country</label>
                                    <Field type="text" className="customInput" name='country' autoComplete='off' disabled value="India" />
                                </div>
                                <div className='col-md-3 position-relative mb-4'>
                                    <label className='custom-label font-13'>State <span className='text-danger'>*</span></label>
                                    <Field as="select" className="customInput p-3" name='state' style={{ background: "#03053d" }}
                                        onChange={(e) => { GetCities(e.target.value); setFieldValue('state', e.target.value) }}>
                                        <option value="0" label="Select" />
                                        {StateArray.length && StateArray?.map((item, index) => {
                                            return <option value={item.id} label={item.name} key={index} />
                                        })}
                                    </Field>
                                    <ErrorMessage name='state' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 position-relative mb-4'>
                                    <label className='custom-label font-13'>City <span className='text-danger'>*</span></label>
                                    <Field as="select" className="customInput p-3" name='city' style={{ background: "#03053d" }}>
                                        <option value="0" label="Select" />
                                        {CityArray.length && CityArray?.map((item, index) => {
                                            return <option value={item.id} label={item.name} key={index} />
                                        })}
                                    </Field>
                                    <ErrorMessage name='city' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 position-relative mb-4'>
                                    <label className='custom-label'>Area <span className='text-danger'>*</span></label>
                                    <Field type="text" className="customInput" name='area' autoComplete='off' />
                                    <ErrorMessage name='area' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 position-relative mb-4'>
                                    <label className='custom-label'>Pincode <span className='text-danger'>*</span></label>
                                    <Field type="text" className="customInput" name='pincode' autoComplete='off' />
                                    <ErrorMessage name='pincode' component="div" className="text-start errorText" />
                                </div>
                                <div className='position-relative mb-4'>
                                    <div className="d-flex flex-wrap align-items-center" style={{ gap: '10px' }}>
                                        <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Scheme Type <span className='text-danger'>*</span></label>
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
                            </div>

                            <div className="row">
                                <div className='col-md-4 position-relative mb-4'>
                                    <label className='custom-label'>Upload Scheme Image</label>
                                    <div style={{ height: "100%" }} className="customInput text-center" name='companyLogo' autoComplete='off' readOnly aria-describedby="logo-upload" value={filedetails.uploadedFileName} onClick={handleLogoUpload}>
                                        {filedetails.uploadedFileName ? (
                                            <img src={filedetails.uploadedFileBase64} className='pt-3' style={{ height: "80px" }} alt="Upload" />

                                        ) : (
                                            <img src={Images.upload_image} className='img-fluid mt-3 upload-image-box' alt="Upload" />
                                        )}
                                    </div>
                                    <Field type="hidden" name="companyLogo" value={filedetails.uploadedFileBase64} />
                                    <input type="file" ref={logoUploadRef} className='d-none' onChange={handleFileChange} accept="image/*"
                                    />
                                </div>
                                <div className='col-md-4 position-relative mb-3'>
                                    <label className='custom-label'>Address <span className='text-danger'>*</span></label>
                                    <Field as="textarea" className="customInput" name='address' autoComplete='off' rows="4" />
                                    <ErrorMessage name='address' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-4 position-relative mb-3'>
                                    <label className='custom-label'>Scheme Description</label>
                                    <Field as="textarea" className="customInput" name='description' autoComplete='off' rows="4" />
                                </div>
                            </div>
                            <div className='text-center'>
                                <button type="button" className='cancelBtn me-2' onClick={(e) => setFormView(1)}>Cancel</button>
                                <button type="submit" className='otpBtn'>Continue</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
