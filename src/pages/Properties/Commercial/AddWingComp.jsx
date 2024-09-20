import React, { useContext, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import WingsValidationSchema from '../../utils/validations/WingsValidationSchema';
import useApiService from '../../services/ApiService';
import { CommercialContext } from '../../context/CommercialContext';
import UnitDetails from './UnitDetails';
import AlertComp from '../../components/AlertComp';
import FloorBasedUnits from './FloorBasedUnits';
import AddMoreWings from './AddMoreWings';
export default function AddWingComp() {
    const { postAPI } = useApiService();
    const { wingDetails, setUtils, setWingDetails, setLoading, setShowAlerts } = useContext(CommercialContext);
    const [sameNumOfUnitFlag, setSameNumOfUnitFlag] = useState(null);
    const [wingStep, setWingStep] = useState(1);
    const submitWingDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            wingName: values?.wingName,
            numberOfFloors: values?.numberofFloors,
            propertyId: utils.propertyId,
            sameUnitFlag: sameNumOfUnitFlag,
            numberOfUnits: values?.numberofUnits,
            floorUnitCounts: null,
            wingId: 0
        })
        try {
            const result = await postAPI('/add-wing-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setWingDetails({
                        wingName: values?.wingName,
                        numberofFloors: values?.numberofFloors,
                        numberofUnits: values?.numberofUnits
                    })
                    setUtils((prev) => ({
                        ...prev,
                        wingId: responseRs?.wingId,
                        floorUnitDetails: responseRs?.floorUnitDetails,
                        floorUnitCounts: responseRs?.floorUnitCounts
                    }));
                    setShowAlerts(<AlertComp show={true} variant="success" message="Wing details added successfully." />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        if (sameNumOfUnitFlag == 1) {
                            setWingStep(3);
                        }
                        else {
                            setWingStep(2);
                        }
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
    return (
        <>
            {wingStep == 1 && (
                <div className="row p-4">
                    <div className='col-md-6 offset-md-3'>
                        <div className='text-center'>
                            <h4 className='heading pt-5'>Add Wing</h4>
                            <p className='font-16 text-white fw-normal'>Please fill wing details to proceed further.</p>
                        </div>
                        <Formik initialValues={{ wingName: wingDetails?.wingName, numberofFloors: wingDetails?.numberofFloors, unitFlag: sameNumOfUnitFlag, numberofUnits: wingDetails?.numberofUnits }} validationSchema={(e) => WingsValidationSchema(sameNumOfUnitFlag)} onSubmit={submitWingDetails} >
                            {({ setFieldValue }) => (
                                <Form onKeyDown={(e) => {
                                    if (e.key == 'Enter') {
                                        e.preventDefault();
                                    }
                                }}>
                                    <div className="row">
                                        <div className='col-md-12 position-relative mb-4'>
                                            <label className='custom-label'>Wing Name <span className='text-danger'>*</span></label>
                                            <Field type="text" className="customInput" name='wingName' autoComplete='off' />
                                            <ErrorMessage name='wingName' component="div" className="text-start errorText" />
                                        </div>
                                        <div className='col-md-12 position-relative mb-5'>
                                            <label className='custom-label'>Number of Floors <span className='text-danger'>*</span></label>
                                            <Field type="number" className="customInput" name='numberofFloors' autoComplete='off' />
                                            <ErrorMessage name='numberofFloors' component="div" className="text-start errorText" />
                                        </div>
                                    </div>
                                    <div className='position-relative mb-5'>
                                        <label className='fw-semibold text-white' style={{ fontSize: '14px' }}>Is there same numbers of units on each Floor <span className='text-danger'>*</span></label>
                                        <div className="d-flex flex-wrap mt-2" style={{ gap: '20px' }}>
                                            <div className={`${sameNumOfUnitFlag == 1 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => { setSameNumOfUnitFlag(1); setFieldValue('unitFlag', 1) }}>Yes</div>
                                            <div className={`${sameNumOfUnitFlag == 2 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`} onClick={() => { setSameNumOfUnitFlag(2); setFieldValue('unitFlag', 2); setFieldValue('numberofUnits', null) }}>No</div>
                                        </div>
                                        <Field type="hidden" name="unitFlag" value={sameNumOfUnitFlag} />
                                        <ErrorMessage name="unitFlag" component="div" className="text-start errorText" />
                                    </div>
                                    {sameNumOfUnitFlag == 1 &&
                                        <div className='col-md-12 position-relative mb-4'>
                                            <label className='custom-label'>Number of Units <span className='text-danger'>*</span></label>
                                            <Field type="number" className="customInput" name='numberofUnits' autoComplete='off' />
                                            <ErrorMessage name='numberofUnits' component="div" className="text-start errorText" />
                                        </div>
                                    }
                                    <div className='mt-2 text-end'>
                                        <button type="submit" className='otpBtn'>Continue</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
            {wingStep == 2 &&
                <FloorBasedUnits setWingStep={setWingStep} />
            }
            {wingStep == 3 &&
                <UnitDetails setWingStep={setWingStep} />
            }
            {wingStep == 4 &&
                <AddMoreWings setWingStep={setWingStep} />
            }
        </>
    )
}
