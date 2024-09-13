import React, { useContext, useEffect, useRef, useState } from 'react'
import { CommercialContext } from '../../context/CommercialContext'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import CommercialValidationSchema from '../../utils/validations/CommercialValidationSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign, faTimes } from '@fortawesome/free-solid-svg-icons';
import { convertToBase64 } from '../../utils/js/Common';
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService';
import AlertComp from '../../components/AlertComp';
import AddWing from './AddWing';

export default function Commercial() {
    const { commercialDetails, propertyTypeDetails, setPropertyTypeDetails, propertyFlag, setPropertyFlag, setPropertyId, commercialStepView, setCommercialStepView } = useContext(CommercialContext);
    const [uploadedPropertyPlanBase64, setUploadedPropertyPlanBase64] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [selectedPropertySubType, setSelectedPropertySubType] = useState(null);
    const PropertyPlanRef = useRef(null);
    const userId = localStorage.getItem('userId');
    const [loading, setLoading] = useState(false);
    const { postAPI, getAPI } = useApiService();
    const [showAlerts, setShowAlerts] = useState(false);

    const handlePropertyPlanUpload = () => {
        PropertyPlanRef.current.click();
    };
    const handlePropertyPlanChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFileName(file.name);
            const base64 = await convertToBase64(file);
            setUploadedPropertyPlanBase64(base64);
            e.target.value = null;
        }
    }
    const handleRemovePropertyPlan = () => {
        setUploadedPropertyPlanBase64('');
        setUploadedFileName('');
        PropertyPlanRef.current.value = null;
    };
    useEffect(() => {
        getPropertyTypes();
    }, [propertyFlag])

    const getPropertyTypes = async () => {
        setLoading(true);
        try {
            const result = await getAPI(`/get-property-types/${propertyFlag}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setLoading(false);
                setPropertyTypeDetails(responseRs);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    const submitCommercialDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            name: values?.propertyName,
            reraRegisteredNumber: values?.reraRegisteredNumber,
            propertyTypeFlag: propertyFlag,
            propertySubTypeFlag: selectedPropertySubType,
            address: values?.address,
            numberOfWings: values?.numberofWings,
            description: values?.description,
            userId: userId,
            pincode: values?.pincode,
            minPrice: values?.minPrice,
            maxPrice: values?.maxPrice,
            propertyPlan: uploadedPropertyPlanBase64 || values?.propertyPlan
        })
        try {
            const result = await postAPI('/property-details-first-step', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setPropertyId(responseRs?.propertyId);
                    setShowAlerts(<AlertComp show={true} variant="success" message="Basic property details added successfully. Now you can add property specific details" />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        setCommercialStepView(1);
                    }, 1500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.msg} />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        setPropertyFlag(0);
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
            {commercialStepView == 0 && (
            <div className="row p-4">
                <div className='col-md-8 offset-md-2'>
                    <h4 className='heading pt-5'>Commercial!</h4>
                    <p className='font-16 text-white fw-normal'>Heyy, please fill all the informations to proceed further.</p>
                    <Formik initialValues={{ propertyName: commercialDetails?.propertyName, reraRegisteredNumber: commercialDetails?.reraRegisteredNumber, propertySubTypeFlag: selectedPropertySubType, address: commercialDetails?.address, pincode: commercialDetails?.pincode, numberofWings: commercialDetails?.numberofWings, description: commercialDetails?.description, minPrice: commercialDetails?.minPrice, maxPrice: commercialDetails?.maxPrice, propertyPlan: commercialDetails?.propertyPlan }} validationSchema={CommercialValidationSchema} onSubmit={submitCommercialDetails}>
                        {({ setFieldValue }) => (
                            <Form className='pt-4 mt-2'>
                                <div className="row">
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Name on Property <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='propertyName' autoComplete='off' />
                                        <ErrorMessage name='propertyName' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Rera registered number <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='reraRegisteredNumber' autoComplete='off' />
                                        <ErrorMessage name='reraRegisteredNumber' component="div" className="text-start errorText" />
                                    </div>
                                </div>
                                <div className='position-relative mb-4'>
                                    <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Property Type <span className='text-danger'>*</span></label>
                                    <div className="d-flex flex-wrap mt-2" style={{ gap: '10px' }}>
                                        {propertyTypeDetails?.sub_properties?.map((subProperty) => (
                                            <button key={subProperty.id} type="button" className={selectedPropertySubType == subProperty.id ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} onClick={() => { setSelectedPropertySubType(subProperty.id); setFieldValue('propertySubTypeFlag', subProperty?.id) }}>
                                                {subProperty.name}
                                            </button>
                                        ))}
                                    </div>
                                    <Field type="hidden" name="propertySubTypeFlag" value={selectedPropertySubType} />
                                    <ErrorMessage name="propertySubTypeFlag" component="div" className="text-start errorText" />
                                </div>
                                <div className="row">
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Address <span className='text-danger'>*</span></label>
                                        <Field as="textarea" className="customInput" name='address' autoComplete='off' rows="4" />
                                        <ErrorMessage name='address' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-3'>
                                        <label className='custom-label'>Property Description</label>
                                        <Field as="textarea" className="customInput" name='description' autoComplete='off' rows="4" />
                                    </div>

                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Pincode <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='pincode' autoComplete='off' />
                                        <ErrorMessage name='pincode' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='col-md-6 position-relative mb-4'>
                                        <label className='custom-label'>Number of Wings / Blocks <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='numberofWings' autoComplete='off' />
                                        <ErrorMessage name='numberofWings' component="div" className="text-start errorText" />
                                    </div>
                                </div>
                                <div className='position-relative mb-5'>
                                    <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Price Range <span className='text-danger'>*</span></label>
                                    <div className="d-flex mt-2">
                                        <div className="input-group flex-nowrap">
                                            <span className="input-group-text"><FontAwesomeIcon icon={faIndianRupeeSign} /></span>
                                            <Field type="number" className="customInput" name='minPrice' autoComplete='off' placeholder='Minimum Price' />
                                            <ErrorMessage name='minPrice' component="div" className="text-start errorText" style={{ top: "50px" }} />
                                        </div>
                                        <div className="input-group flex-nowrap ms-2 position-relative">
                                            <Field type="number" className="customInput" name='maxPrice' autoComplete='off' />
                                            <span className="input-group-text"><FontAwesomeIcon icon={faIndianRupeeSign} /></span>
                                            <ErrorMessage name='maxPrice' component="div" className="text-start errorText" style={{ top: "50px" }} />
                                        </div>
                                    </div>

                                </div>
                                <div className='commercial-form-input mt-2'>
                                    <div className='input-group mb-4 cursor-pointer' onClick={handlePropertyPlanUpload}>
                                        <label className='custom-label'>Upload Property Plan</label>
                                        <Field className="customInput" name='propertyPlan' autoComplete='off' readOnly aria-describedby="logo-upload" style={{ width: '90%', borderRight: 'none' }} value={uploadedFileName} />
                                        <span className="input-group-text" id="logo-upload">Upload</span>
                                        <input type="file" ref={PropertyPlanRef} className='d-none' accept="image/*" onChange={handlePropertyPlanChange} />
                                    </div>
                                    {uploadedPropertyPlanBase64 || commercialDetails?.propertyPlan ? (
                                        <div className='mb-4 position-relative'>
                                            <img src={uploadedPropertyPlanBase64 || commercialDetails?.propertyPlan} alt="Property plan" style={{ maxWidth: '150px', maxHeight: '150px', border: '2px solid white', padding: '10px' }} />
                                            <FontAwesomeIcon icon={faTimes} onClick={handleRemovePropertyPlan} className='close-icon' style={{ left: '26%' }} />
                                        </div>
                                    ) : null}
                                </div>

                                <div className='mt-1 text-end'>
                                    <button type="submit" className='otpBtn'>Continue</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            )}
            {commercialStepView == 1 && 
                <AddWing/>
            }
        </>
    )
}
