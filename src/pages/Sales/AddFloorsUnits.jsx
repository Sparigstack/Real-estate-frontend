import { ErrorMessage, Field, Formik } from 'formik';
import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import { FloorUnitsValidationSchema } from '../../utils/validations/FloorUnitsValidationSchema';
import useProperty from '../../hooks/useProperty';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import Loader from '../../components/loader/Loader';

export default function AddFloorsUnits({ activeWingId, getAllWings, setShowAddFloordiv }) {
    const [loading, setLoading] = useState(false);
    const { schemeId } = useProperty();
    const [showAlerts, setShowAlerts] = useState(false);
    const { postAPIAuthKey } = useApiService();
    const [allData, setallData] = useState({
        totalFloors: 0,
        unitFlag: 2,
        unitsFloorWise: 0,
        unitsArray: []
    })
    const [totalUnits, setTotalUnits] = useState(0);
    const submitFloorUnitDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            wingId: activeWingId,
            propertyId: schemeId,
            numberOfFloors: values.totalFloors,
            sameUnitsFlag: values.unitFlag,
            sameUnitCount: values.unitsFloorWise,
            unitDetails: values.unitsArray
        })
        try {
            const result = await postAPIAuthKey('/add-wings-floor-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message="Floors and Units Added Successfully." />);
                    setTimeout(() => {
                        setLoading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        getAllWings()
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
    return (
        <>
            {loading && <Loader runningcheck={loading} />}
            {showAlerts}
            <div className='col-md-6 offset-md-2 p-5 pt-3'>
                <div className='row ps-0 align-items-center'>
                    <h4 className='fontwhite ps-0 fw-bolder mb-0'>Add Floors Details !</h4>
                    <p className='font-14 ps-0 pt-1 color-D8DADCE5 fw-normal'>Heyy, please fill all the informations to proceed further.</p>
                </div>
                <Formik initialValues={allData}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={FloorUnitsValidationSchema(allData.unitFlag)}
                    onSubmit={(values) => {
                        submitFloorUnitDetails(values);
                        setallData(values);
                    }}>
                    {({ values, setFieldValue, handleSubmit }) => (
                        <Form className='pt-2 mt-2 property-form' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <div className="row">
                                <div className='col-12 ps-0 position-relative'>
                                    <label className='custom-label'>How many floors would you like to add?<span className='text-danger'>*</span></label>
                                    <Field type="number" className="customInput" name='totalFloors' autoComplete='off'
                                        onChange={(e) => {
                                            const totalFloors = parseInt(e.target.value || 0, 10);
                                            setFieldValue('totalFloors', totalFloors);
                                            setTotalUnits(values.unitsFloorWise * e.target.value);
                                            if (values.unitFlag == 0) {
                                                setFieldValue('unitsArray', new Array(totalFloors).fill({ floorNo: '', unitCount: '' }));
                                            }
                                        }} />
                                    <ErrorMessage name='totalFloors' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-12 ps-0 position-relative my-4'>
                                    <div className="d-flex flex-wrap align-items-center">
                                        <label className='text-white font-14'>Is there same numbers of unit on Each floor?<span className='text-danger'>*</span></label>
                                        <div className={`ms-2 py-2 px-3 ${values.unitFlag == 1 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`}
                                            onClick={() => {
                                                setFieldValue('unitFlag', 1);
                                                setTotalUnits(0);
                                                setFieldValue('unitsArray', []);
                                                setFieldValue('unitsFloorWise', 0);
                                                setallData((prev) => ({ prev, unitFlag: 1 }))
                                            }}>
                                            Yes
                                        </div>
                                        <div className={`ms-2 py-2 px-3 ${values.unitFlag == 0 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`}
                                            onClick={() => {
                                                setFieldValue('unitFlag', 0);
                                                setTotalUnits(0);
                                                setFieldValue('unitsArray', new Array(values.totalFloors).fill({ floorNo: '', unitCount: '' }));
                                                setFieldValue('unitsFloorWise', 0);
                                                setallData((prev) => ({ prev, unitFlag: 0 }))
                                            }}>
                                            No
                                        </div>
                                    </div>
                                    <Field type="hidden" name="unitFlag" value={values.unitFlag} />
                                    <ErrorMessage name="unitFlag" component="div" className="text-start errorText" />
                                </div>
                            </div>
                            <div className='row'>
                                {values.unitFlag == 1 ?
                                    <div className='col-md-9 ps-0 position-relative mb-4'>
                                        <label className='custom-label'>How many units on Each floor?<span className='text-danger'>*</span></label>
                                        <Field type="number" className="customInput" name='unitsFloorWise' autoComplete='off'
                                            onChange={(e) => {
                                                const unitsPerFloor = parseInt(e.target.value || 0, 10);
                                                setTotalUnits(unitsPerFloor * values.totalFloors);
                                                setFieldValue('unitsFloorWise', e.target.value)
                                            }} />
                                        <ErrorMessage name='unitsFloorWise' component="div" className="text-start errorText" />
                                    </div>
                                    : values.unitFlag == 0 ?
                                        <div className='col-12 mb-3'>
                                            <div className='text-white font-14 ps-0'>Write number of units Floor wise.</div>
                                            <div className='row pt-3'>
                                                {Array.from({ length: values.totalFloors }).map((_, index) => (
                                                    <div key={index} className='col-md-3 me-2 ps-0 position-relative mb-4 pe-0'>
                                                        <label className='custom-label'>
                                                            Floor {index + 1}<label className='text-danger'>*</label>
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            className="customInput"
                                                            name={`unitsArray[${index}].unitCount`}
                                                            autoComplete='off'
                                                            onChange={(e) => {
                                                                const units = parseInt(e.target.value || 0, 10);
                                                                const updatedUnitsArray = [...values.unitsArray];
                                                                updatedUnitsArray[index] = { floorNo: index + 1, unitCount: units };
                                                                setFieldValue('unitsArray', updatedUnitsArray);
                                                                setTotalUnits(updatedUnitsArray.reduce((sum, floor) => sum + (floor.unitCount || 0), 0));
                                                            }}
                                                        />
                                                        <ErrorMessage name={`unitsArray[${index}].unitCount`} component="div" className="text-start errorText" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        : null
                                }
                                {values.unitFlag != 2 && (
                                    <div className='col-md-3 ps-0 position-relative mb-4'>
                                        <label className='custom-label'>Total Units</label>
                                        <Field type="number" className="customInput" autoComplete='off' disabled value={totalUnits} />
                                    </div>
                                )}
                            </div>
                            <div className='pt-3 text-center'>
                                <button type="btn" className='px-4 cancelBtn me-2' onClick={(e) => setShowAddFloordiv(false)}>Cancel</button>
                                <button type="submit" className='otpBtn'>Save</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}
