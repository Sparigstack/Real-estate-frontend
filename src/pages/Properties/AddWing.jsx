import React, { useContext, useState } from 'react'
import { CommercialContext } from '../../context/CommercialContext';
import { Field, Formik, Form, ErrorMessage } from 'formik'
import WingsValidationSchema from '../../utils/validations/WingsValidationSchema';
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService';
import AlertComp from '../../components/AlertComp';
export default function AddWing() {
    const { wingDetails, propertyId, setWingId } = useContext(CommercialContext);
    const [sameNumOfUnitFlag, setSameNumOfUnitFlag] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const { postAPI} = useApiService();

    const submitWingDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            wingName: values?.wingName,
            wingSize: values?.wingSize,
            numberOfFloors: values?.numberofFloors,
            propertyId: propertyId,
            sameUnitFlag: sameNumOfUnitFlag,            
        })
        try {
            const result = await postAPI('/property-details-second-step', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setWingId(responseRs?.wingId);
                    setShowAlerts(<AlertComp show={true} variant="success" message="Wing details added successfully." />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                    }, 1500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.msg} />);
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
                <div className='col-md-8 offset-md-2'>
                    <h4 className='heading pt-5'>Add Wing</h4>
                    <p className='font-16 text-white fw-normal'>Please fill wing details to proceed further.</p>
                    <Formik initialValues={{ wingName: wingDetails?.wingName, wingSize: wingDetails?.wingSize, numberofFloors: wingDetails?.numberofFloors, unitFlag: sameNumOfUnitFlag }} validationSchema={WingsValidationSchema} onSubmit={submitWingDetails} >
                        {({ setFieldValue }) => (
                            <Form>
                                <div className="row">
                                    <div className=' position-relative mb-4'>
                                        <label className='custom-label'>Wing Name <span className='text-danger'>*</span></label>
                                        <Field type="text" className="customInput" name='wingName' autoComplete='off' />
                                        <ErrorMessage name='wingName' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='position-relative mb-5'>
                                        <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Wing Size <span className='text-danger'>*</span></label>
                                        <div className="input-group flex-nowrap">
                                            <Field type="number" className="customInput" name='wingSize' autoComplete='off' />
                                            <span className="input-group-text">sq feet</span>
                                            <ErrorMessage name='wingSize' component="div" className="text-start errorText" style={{ top: "50px" }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className=' position-relative mb-5'>
                                        <label className='custom-label'>Number of Floors <span className='text-danger'>*</span></label>
                                        <Field type="number" className="customInput" name='numberofFloors' autoComplete='off' />
                                        <ErrorMessage name='numberofFloors' component="div" className="text-start errorText" />
                                    </div>
                                    <div className='position-relative mb-5'>
                                        <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Is there same numbers of unit on each Floor <span className='text-danger'>*</span></label>
                                        <div className="d-flex flex-wrap mt-2" style={{ gap: '20px' }}>
                                            <button className={`${sameNumOfUnitFlag == 1 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'}`} onClick={() => { setSameNumOfUnitFlag(1); setFieldValue('unitFlag', 1) }}>Yes</button>
                                            <button className={`${sameNumOfUnitFlag == 0 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'}`} onClick={() => { setSameNumOfUnitFlag(0); setFieldValue('unitFlag', 0) }}>No</button>
                                        </div>
                                        <Field type="hidden" name="unitFlag" value={sameNumOfUnitFlag} />
                                        <ErrorMessage name="unitFlag" component="div" className="text-start errorText" />
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
        </>
    )
}
