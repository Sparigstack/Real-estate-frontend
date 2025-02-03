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
import UpgradePlanPopup from '../../components/UpgradePlan/UpgradePlanPopup';

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
    const [propertyTypeArray, setpropertyTypeArray] = useState([]);
    const [StateArray, setStateArray] = useState([]);
    const [CityArray, setCityArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [PlanPopup, setPlanPopup] = useState(false);
    const [planResponse, setPlanResponse] = useState({
        moduleid: "",
        planname: "",
        previousPath: location.pathname,
        buttontext: ""
    })
    useEffect(() => {

        getPropertyTypes();

    }, []);
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
    const submitCommercialDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            name: values?.propertyname,
            reraRegisteredNumber: values?.reraregisterednumber || null,
            propertyTypeFlag: schemeType,
            propertySubTypeFlag: values?.propertysubtype,
            address: values?.address,
            description: values?.description ? values?.description : null,
            userId: userId,
            pincode: values?.pincode,
            property_img: filedetails?.uploadedFileBase64 || null,
            state: values?.state,
            city: values?.city,
            area: values?.area,
            userCapabilities: 'schemes_units_config'
        })
        try {
            const result = await postAPIAuthKey('/add-property-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                setLoading(false);
                if (responseRs.status == 'success') {
                    Cookies.set('schemeId', responseRs.propertyId, { expires: 1 });
                    setShowAlerts(<AlertComp show={true} variant="success" message="Scheme Added Successfully." />);
                    await switchProperty(responseRs.propertyId);
                    setTimeout(() => {
                        setShowAlerts(false);
                        navigate("/sales-dashboard");
                    }, 2500);
                } else if (responseRs.status == "upgradeplan") {
                    setPlanResponse({
                        ...planResponse, moduleid: responseRs.moduleid, planname: responseRs.activeplanname,
                        buttontext: responseRs.buttontext
                    });
                    setPlanPopup(true);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(false);
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
        setLoading(true);
        var cities = await getCities(stateid);
        if (cities) {
            setLoading(false);
            setCityArray(cities)
        }
    }
    return (
        <div className='h-100vh content-area'>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='col-md-8 ps-0 offset-md-2 p-2'>
                <div className='row align-items-center pt-3'>
                    <div className='col-1 ps-0'>
                        <img src={Images.backArrow} alt="back-arrow" style={{ height: "40px" }}
                            className='cursor-pointer' onClick={() => setFormView(1)} />
                    </div>
                    <div className='col-11 ps-0'>
                        <h4 className='heading mb-0'>{schemeType == 1 ? 'Commercial Project' : 'Residential Project'}</h4>
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
                                <div className='col-md-8 ps-0 position-relative mb-4'>
                                    <label className='custom-label'>Project Name <span className='text-danger'>*</span></label>
                                    <Field type="text" className="customInput" name='propertyname' autoComplete='off' />
                                    <ErrorMessage name='propertyname' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-4 ps-0 position-relative mb-4'>
                                    <label className='custom-label font-13'>Scheme Type <span className='text-danger'>*</span></label>
                                    <Field as="select" className="customInput" name='propertysubtype' style={{ background: "#03053d", padding: '1em' }}>
                                        <option value="0" label="Select" />
                                        {propertyTypeArray.length && propertyTypeArray?.map((item, index) => {
                                            return <option value={item.id} label={item.name} key={index} />
                                        })}
                                    </Field>
                                    <ErrorMessage name='propertysubtype' component="div" className="text-start errorText" />
                                </div>

                                <div className='col-md-8 ps-0 position-relative mb-4'>
                                    <label className='custom-label'>Address <span className='text-danger'>*</span></label>
                                    <Field as="textarea" className="customInput" name='address' autoComplete='off' rows="1" />
                                    <ErrorMessage name='address' component="div" className="text-start errorText" />
                                </div>

                                <div className='col-md-4 ps-0 position-relative mb-4'>
                                    <label className='custom-label'>Area <span className='text-danger'>*</span></label>
                                    <Field type="text" className="customInput" name='area' autoComplete='off' />
                                    <ErrorMessage name='area' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 ps-0 position-relative'>
                                    <label className='custom-label font-13'>State <span className='text-danger'>*</span></label>
                                    <Field as="select" className="customInput" name='state' style={{ background: "#03053d", padding: '1em' }}
                                        onChange={(e) => { GetCities(e.target.value); setFieldValue('state', e.target.value) }}>
                                        <option value="0" label="Select" />
                                        {StateArray.length && StateArray?.map((item, index) => {
                                            return <option value={item.id} label={item.name} key={index} />
                                        })}
                                    </Field>
                                    <ErrorMessage name='state' component="div" className="text-start errorText" />
                                </div>

                                <div className='col-md-3 ps-0 position-relative'>
                                    <label className='custom-label font-13'>City <span className='text-danger'>*</span></label>
                                    <Field as="select" className="customInput" name='city' style={{ background: "#03053d", padding: '1em' }}>
                                        <option value="0" label="Select" />
                                        {CityArray.length && CityArray?.map((item, index) => {
                                            return <option value={item.id} label={item.name} key={index} />
                                        })}
                                    </Field>
                                    <ErrorMessage name='city' component="div" className="text-start errorText" />
                                </div>

                                <div className='col-md-3 ps-0 position-relative'>
                                    <label className='custom-label'>Pincode <span className='text-danger'>*</span></label>
                                    <Field type="text" className="customInput" name='pincode' autoComplete='off' />
                                    <ErrorMessage name='pincode' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 ps-0 position-relative'>
                                    <label className='custom-label'>Rera registered number(optional)</label>
                                    <Field type="text" className="customInput" name='reraregisterednumber' autoComplete='off' />
                                </div>

                            </div>

                            <div className="row mt-4">
                                <div className='col-md-6 ps-0 position-relative mb-4'>
                                    <label className='custom-label'>Upload Scheme Image(optional)</label>
                                    <div style={{ height: "100%" }} className="customInput text-center" name='companyLogo' autoComplete='off' readOnly aria-describedby="logo-upload" value={filedetails.uploadedFileName} onClick={handleLogoUpload}>
                                        {filedetails.uploadedFileName ? (
                                            <img src={filedetails.uploadedFileBase64} className='pt-3' style={{ height: "80px" }} alt="Upload" />

                                        ) : (
                                            <img src={Images.upload_image} className='img-fluid mt-3 upload-image-box cursor-pointer' alt="Upload" />
                                        )}
                                    </div>
                                    <Field type="hidden" name="companyLogo" value={filedetails.uploadedFileBase64} />
                                    <input type="file" ref={logoUploadRef} className='d-none' onChange={handleFileChange} accept="image/*"
                                    />
                                </div>
                                <div className='col-md-6 ps-0 position-relative mb-3'>
                                    <label className='custom-label'>Scheme Description(optional)</label>
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
            {PlanPopup && <UpgradePlanPopup show={PlanPopup} onHide={() => setPlanPopup(false)}
                data={planResponse} getfunction={(e) => getPropertyTypes()} />}
        </div>
    )
}
