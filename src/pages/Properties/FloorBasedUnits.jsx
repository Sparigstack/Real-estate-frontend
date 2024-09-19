import React, { useContext, useState } from 'react'
import * as Yup from 'yup';
import { Field, Formik, Form, ErrorMessage } from 'formik'
import { CommercialContext } from '../../context/CommercialContext';
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import useApiService from '../../services/ApiService';
import AlertComp from '../../components/AlertComp';

const floorWiseUnitsValidationSchema = (floorUnitCounts) => {
    const schemaFields = floorUnitCounts.reduce((acc, floor) => {
        acc[`unitsEachFloor${floor.floorId}`] = Yup.number()
            .required('Unit is required')
            .typeError('Unit must be a number')
            .positive('Unit must be a positive number')
            .integer('Unit must be an integer');
        return acc;
    }, {});
    return Yup.object().shape(schemaFields);
}

export default function FloorBasedUnits({setWingStep}) {
    const { floorUnitCounts, wingDetails, propertyId, wingId, setFloorUnitDetails } = useContext(CommercialContext);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false); 
    const { postAPI } = useApiService();
    
    const submitFloorViseUnitDetails = async (values) => {
        setLoading(true);
        const floorUnitCountsArray = floorUnitCounts.map(floor => ({
            floorId: floor?.floorId,
            unit: values[`unitsEachFloor${floor?.floorId}`]
        }))
        var raw = JSON.stringify({
            wingName: wingDetails?.wingName,
            numberOfFloors: wingDetails?.numberofFloors,
            propertyId: propertyId,
            sameUnitFlag: 3,
            numberOfUnits: wingDetails?.numberofUnits,
            floorUnitCounts: floorUnitCountsArray,
            wingId: wingId
        })
        try {
            const result = await postAPI('/add-wing-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setFloorUnitDetails(responseRs?.floorUnitDetails);
                    setShowAlerts(<AlertComp show={true} variant="success" message="Number of Units for each floor added successfully." />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        setWingStep(3);
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
        {showAlerts}
        {loading ? <ShowLoader /> : <HideLoader />}
        <div className="row p-4">
            <div className='col-md-6 offset-md-3'>
                <div className='text-center'>
                    <p className='text-white fw-medium mt-4' style={{fontSize:'20px'}}>Enter Number of Units Floor vise</p>
                </div>
                <Formik initialValues={floorUnitCounts.reduce((acc, floor) => {
                    acc[`unitsEachFloor${floor.floorId}`] = '';
                    return acc;
                }, {})} validationSchema={floorWiseUnitsValidationSchema(floorUnitCounts)} onSubmit={submitFloorViseUnitDetails}>
                    {({ setFieldValue }) => {
                        const handleAutofill = (value) => {
                            floorUnitCounts?.forEach((floor) => {
                                setFieldValue(`unitsEachFloor${floor.floorId}`, value);
                            })
                        }
                        return (
                            <Form className='pt-4 mt-2'>
                                <div className='d-flex flex-wrap gap-4 justify-content-center'>
                                    {floorUnitCounts?.map((floor, floorIndex) => (
                                        <div key={floor?.floorId} className='unit-container position-relative mb-2 mt-3'>
                                            <label className='custom-label'>Floor {floorIndex + 1}<span className='text-danger'>*</span></label>
                                            <Field type="number" className="customInput" name={`unitsEachFloor${floor?.floorId}`} autoComplete='off' onChange={(e) => {
                                                const value = e.target.value;
                                                setFieldValue(`unitsEachFloor${floor?.floorId}`, value);
                                                if (floorIndex == 0) {
                                                    handleAutofill(value);
                                                }
                                            }}
                                                style={{ transition: 'opacity 0.3s ease' }} />
                                            <ErrorMessage name={`unitsEachFloor${floor?.floorId}`} component="div" className="text-start errorText" style={{ top: '48px' }} />
                                        </div>
                                    ))}
                                </div>
                                <div className='mt-5 text-end'>
                                    <button type="submit" className='otpBtn'>Continue</button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
        </>
    )
}
