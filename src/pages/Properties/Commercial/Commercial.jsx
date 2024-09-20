import React, { useContext, useEffect, useState } from 'react'
import { CommercialContext } from '../../../context/CommercialContext'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import CommercialValidationSchema from '../../../utils/validations/CommercialValidationSchema';
import useApiService from '../../../services/ApiService';
import AlertComp from '../../../components/AlertComp';
import Cookies from "js-cookie";
import WingParent from './WingParent';
export default function Commercial() {
    const { commercialDetails, setLoading, setShowAlerts, utils, setUtils } = useContext(CommercialContext);
    const [selectedPropertySubType, setSelectedPropertySubType] = useState(null);
    const userId = Cookies.get('userId');
    const { postAPI, getAPI } = useApiService();
    const [totalSteps, setTotalSteps] = useState(null);
    useEffect(() => {
        getPropertyTypes();
    }, [utils.propertyFlag])

    const getPropertyTypes = async () => {
        setLoading(true);
        try {
            const result = await getAPI(`/get-property-types/${utils.propertyFlag}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setLoading(false);
                setUtils((prev) => ({
                    ...prev,
                    propertyTypeDetails: responseRs
                }));
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
            reraRegisteredNumber: values?.reraRegisteredNumber ? values?.reraRegisteredNumber : null,
            propertyTypeFlag: utils.propertyFlag,
            propertySubTypeFlag: selectedPropertySubType,
            address: values?.address,
            numberOfWings: values?.numberofWings,
            description: values?.description ? values?.description : null,
            userId: userId,
            pincode: values?.pincode
        })
        try {
            const result = await postAPI('/add-property-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setUtils({ ...utils, propertyId: responseRs?.propertyId })
                    setTotalSteps(values?.numberofWings)
                    setShowAlerts(<AlertComp show={true} variant="success" message="Basic property details added successfully. Now you can add property specific details" />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        setUtils((prev) => ({
                            ...prev,
                            commercialStepView: 1
                        }));
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
    return (
        <>
            {utils.commercialStepView == 0 && (
                <div className="row p-4">
                    <div className='col-md-8 offset-md-2'>
                        <h4 className='heading'>Commercial!</h4>
                        <p className='font-16 text-white fw-normal'>Heyy, please fill all the informations to proceed further.</p>
                        <Formik initialValues={{ propertyName: commercialDetails?.propertyName, reraRegisteredNumber: commercialDetails?.reraRegisteredNumber, propertySubTypeFlag: selectedPropertySubType, address: commercialDetails?.address, pincode: commercialDetails?.pincode, numberofWings: commercialDetails?.numberofWings, description: commercialDetails?.description }} validationSchema={CommercialValidationSchema} onSubmit={submitCommercialDetails}>
                            {({ setFieldValue }) => (
                                <Form className='pt-4 mt-2' onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        e.preventDefault();
                                    }
                                }}>
                                    <div className="row">
                                        <div className='col-md-6 position-relative mb-4'>
                                            <label className='custom-label'>Name on Property <span className='text-danger'>*</span></label>
                                            <Field type="text" className="customInput" name='propertyName' autoComplete='off' />
                                            <ErrorMessage name='propertyName' component="div" className="text-start errorText" />
                                        </div>
                                        <div className='col-md-6 position-relative mb-4'>
                                            <label className='custom-label'>Rera registered number</label>
                                            <Field type="text" className="customInput" name='reraRegisteredNumber' autoComplete='off' />
                                        </div>
                                    </div>
                                    <div className='position-relative mb-5'>
                                        <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Property Type <span className='text-danger'>*</span></label>
                                        <div className="d-flex flex-wrap mt-2" style={{ gap: '10px' }}>
                                            {utils.propertyTypeDetails?.sub_properties?.map((subProperty) => (
                                                <div key={subProperty.id} className={`${selectedPropertySubType == subProperty.id ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => { setSelectedPropertySubType(subProperty.id); setFieldValue('propertySubTypeFlag', subProperty?.id) }}>
                                                    {subProperty.name}
                                                </div>
                                            ))}
                                        </div>
                                        <Field type="hidden" name="propertySubTypeFlag" value={selectedPropertySubType} />
                                        <ErrorMessage name="propertySubTypeFlag" component="div" className="text-start errorText" />
                                    </div>
                                    <div className="row">
                                        <div className='col-md-6 position-relative mb-5'>
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
                                            <Field type="number" className="customInput" name='numberofWings' autoComplete='off' />
                                            <ErrorMessage name='numberofWings' component="div" className="text-start errorText" />
                                        </div>
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
            {utils.commercialStepView == 1 &&
                <WingParent totalSteps={totalSteps} />
            }
        </>
    )
}
