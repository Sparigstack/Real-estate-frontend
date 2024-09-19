import React, { useContext, useEffect, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import useApiService from '../../services/ApiService';
import { CommercialContext } from '../../context/CommercialContext';
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import AlertComp from '../../components/AlertComp';

export default function AddMoreWings({setWingStep}) {
    const [sameWingFlag, setSameWingFlag] = useState(null);
    const [selectedWing, setSelectedWing] = useState(null);
    const [wingDetailsArray, setWingDetailsArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const { propertyId } = useContext(CommercialContext);
    const { getAPI, postAPI } = useApiService();

    useEffect(() => {
        getWingDetails();
    }, []);
    const getWingDetails = async () => {
        setLoading(true);
        try {
            const result = await getAPI(`/get-wing-details/${propertyId}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setLoading(false);
                setWingDetailsArray(responseRs);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const submitMoreWingDetails = async (values) => {
        if(sameWingFlag == 1){
            setLoading(true);
            var raw = JSON.stringify({
               
            })
            try {
                const result = await postAPI('/add-wing-details', raw);
                if (!result || result == "") {
                    alert('Something went wrong');
                } else {
                    const responseRs = JSON.parse(result);
                    if (responseRs.status == 'success') {                        
                        setShowAlerts(<AlertComp show={true} variant="success" message="Wing details added successfully." />);
                        setTimeout(() => {
                            setLoading(false);
                            setShowAlerts(<AlertComp show={false} />);
                        }, 2000);
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
        else{
            setWingStep(1);
        }
    }
    const MoreWingsValidationSchema = Yup.object().shape({
        wingFlag: Yup.number().required('Please select Yes or No').oneOf([0, 1], 'Invalid option'),
        selectWing: Yup.string().required('Please Select Wing'),
        wingName: Yup.string().required('Wing Name is required'),
    })

    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className="row p-4">
                <div className='col-md-6 offset-md-3'>
                    <div className='text-center'>
                        <h4 className='heading pt-5'>Add Wing</h4>
                        <p className='font-16 text-white fw-normal'>Add more wings</p>
                    </div>
                    <Formik initialValues={{ wingFlag: sameWingFlag, selectWing: selectedWing, wingName: '' }} validationSchema={MoreWingsValidationSchema} onSubmit={submitMoreWingDetails} >
                        {({ setFieldValue }) => (
                            <Form>
                                <div className='position-relative mb-5'>
                                    <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Is this wing same as other wings? <span className='text-danger'>*</span></label>
                                    <div className="d-flex flex-wrap mt-2" style={{ gap: '20px' }}>
                                        <div className={`${sameWingFlag == 1 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => { setSameWingFlag(1); setFieldValue('wingFlag', 1) }}>Yes</div>
                                        <div className={`${sameWingFlag == 0 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => { setSameWingFlag(0); setFieldValue('wingFlag', 0); setFieldValue('numberofUnits', null) }}>No</div>
                                    </div>
                                    <Field type="hidden" name="wingFlag" value={sameWingFlag} />
                                    <ErrorMessage name="wingFlag" component="div" className="text-start errorText" />
                                </div>
                                {sameWingFlag == 1 && (
                                    <>
                                        <div className='position-relative mb-5'>
                                            <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Select the wing with which a new wing is similar <span className='text-danger'>*</span></label>
                                            <div className="d-flex flex-wrap mt-2" style={{ gap: '20px' }}>
                                                {wingDetailsArray.map((wing) => (
                                                    <div key={wing?.id} className={`${selectedWing == wing?.id ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} style={{ padding: '20px' }} onClick={() => { setSelectedWing(wing?.id); setFieldValue('selectWing', wing?.id) }}>{wing?.name}</div>
                                                ))}
                                            </div>
                                            <Field type="hidden" name="selectWing" value={selectedWing} />
                                            <ErrorMessage name="selectWing" component="div" className="text-start errorText" />
                                        </div>
                                        <div className='position-relative mb-4'>
                                            <label className='custom-label'>New Wing Name <span className='text-danger'>*</span></label>
                                            <Field type="text" className="customInput" name='wingName' autoComplete='off' />
                                            <ErrorMessage name='wingName' component="div" className="text-start errorText" />
                                        </div>
                                    </>
                                )}
                                <div className='mt-2 text-end'>
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
