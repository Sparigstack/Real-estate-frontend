import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import { FloorUnitsValidationSchema } from '../../utils/validations/FloorUnitsValidationSchema';
import useProperty from '../../hooks/useProperty';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import Loader from '../../components/loader/Loader';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import UpgradePlanPopup from '../../components/UpgradePlan/UpgradePlanPopup';

export default function AddFloorsUnits({ activeWingId, UnitDetailsCount, setShowAddFloordiv }) {
    const [loading, setLoading] = useState(false);
    const userid = Cookies.get('userId');
    const { schemeId, refreshPropertyDetails } = useProperty();
    const [showAlerts, setShowAlerts] = useState(false);
    const [yesnoRadio, setYesnoRadio] = useState(0);
    const [WingsWithData, setWingsWithData] = useState([])
    const { postAPIAuthKey, getAPIAuthKey } = useApiService();
    const [PlanPopup, setPlanPopup] = useState(false);
    const [planResponse, setPlanResponse] = useState({
        moduleid: "",
        planname: "",
        previousPath: location.pathname
    })
    const [allData, setallData] = useState({
        totalFloors: '',
        unitFlag: 2,
        unitsFloorWise: '',
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
            unitDetails: values.unitsArray,
            userId: userid,
            userCapabilities: "schemes_units_config"
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
                        setShowAlerts(false);
                        refreshPropertyDetails()
                    }, 2500);
                } else if (responseRs.status == "upgradeplan") {
                    setLoading(false);
                    setPlanResponse({ ...planResponse, moduleid: responseRs.moduleid, planname: responseRs.activeplanname });
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
    const SelectedWingValidationSchema = Yup.object().shape({
        selectedwing: Yup.number().required('Wing is required').notOneOf([0], 'Please select a valid wing'),
    });
    const getWingsUnitFloors = async () => {
        try {
            const result = await getAPIAuthKey(`/wings-with-units-floors/${schemeId}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setWingsWithData(responseRs)
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    useEffect(() => {
        setYesnoRadio(0);
        getWingsUnitFloors();
    }, [activeWingId]);
    const submitSimilarWingDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            selectedwingId: values.selectedwing,
            propertyid: schemeId,
            currentwingid: activeWingId,
            userId: userid,
            userCapabilities: "schemes_units_config"
        })
        try {
            const result = await postAPIAuthKey('/add-similar-wing-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                setLoading(false);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message="Floors and Units Added Successfully." />);
                    setTimeout(() => {
                        setShowAlerts(false);
                        refreshPropertyDetails()
                    }, 2500);
                } else if (responseRs.status == "upgradeplan") {
                    setPlanResponse({ ...planResponse, moduleid: responseRs.moduleid, planname: responseRs.activeplanname });
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
    const AddFloorsDiv = (
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
                            <label className='custom-label'>How many floors does this wing have?<span className='text-danger'>*</span></label>
                            <Field type="number" min={0} className="customInput" name='totalFloors' autoComplete='off'
                                onChange={(e) => {
                                    const totalFloors = parseInt(e.target.value, 10);
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
                                        setallData((prev) => ({ prev, unitFlag: 1 }))
                                    }}>
                                    Yes
                                </div>
                                <div className={`ms-2 py-2 px-3 ${values.unitFlag == 0 ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer`}
                                    onClick={() => {
                                        setFieldValue('unitFlag', 0);
                                        setTotalUnits(0);
                                        setFieldValue('unitsArray', new Array(values.totalFloors).fill({ floorNo: '', unitCount: '' }));

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
                                <Field type="number" min={0} className="customInput" name='unitsFloorWise' autoComplete='off'
                                    onChange={(e) => {
                                        const unitsPerFloor = parseInt(e.target.value, 10);
                                        setTotalUnits(unitsPerFloor * values.totalFloors);
                                        setFieldValue('unitsFloorWise', e.target.value)
                                    }} />
                                <ErrorMessage name='unitsFloorWise' component="div" className="text-start errorText" />
                            </div>
                            : values.unitFlag == 0 ?
                                values.totalFloors > 0 && (
                                    <div className='col-12 mb-3'>
                                        <div className='text-white font-14 ps-0'>Write number of units Floor wise.</div>
                                        <div className='row pt-3'>
                                            {Array.from({ length: values.totalFloors }).map((_, index) => (
                                                <div key={index} className='col-md-3 ps-0 position-relative mb-4 '>
                                                    <label className='custom-label'>
                                                        Floor {index + 1}<label className='text-danger'>*</label>
                                                    </label>
                                                    <Field
                                                        type="number"
                                                        min={0}
                                                        className="customInput"
                                                        name={`unitsArray[${index}].unitCount`}
                                                        autoComplete='off'
                                                        onChange={(e) => {
                                                            const units = parseInt(e.target.value, 10);
                                                            const updatedUnitsArray = [...values.unitsArray];
                                                            for (let i = index; i < values.totalFloors; i++) {
                                                                updatedUnitsArray[i] = { floorNo: i + 1, unitCount: units };
                                                            }
                                                            setFieldValue('unitsArray', updatedUnitsArray);
                                                            setTotalUnits(updatedUnitsArray.reduce((sum, floor) => sum + (floor.unitCount || 0), 0));
                                                        }}
                                                    />
                                                    <ErrorMessage name={`unitsArray[${index}].unitCount`} component="div" className="text-start errorText" />
                                                </div>
                                            ))}

                                        </div>
                                    </div>)
                                : null
                        }
                        {values.unitFlag != 2 && (
                            <div className='col-md-3 ps-0 position-relative mb-4'>
                                <label className='custom-label'>Total Units</label>
                                <Field type="number" min={0} className="customInput" autoComplete='off' disabled value={totalUnits} />
                            </div>
                        )}
                    </div>
                    <div className='pt-3 text-center'>
                        <button type="btn" className='px-4 cancelBtn me-2' onClick={(e) => { setShowAddFloordiv(false); setYesnoRadio(0) }}>Cancel</button>
                        <button type="submit" className='otpBtn'>Save</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
    return (
        <>
            {loading && <Loader runningcheck={loading} />}
            {showAlerts}
            {WingsWithData?.length > 0 ?
                <div className='col-md-6 offset-md-2 p-5 pt-3'>
                    <div className='row ps-0 align-items-center'>
                        <h4 className='fontwhite ps-0 fw-bolder mb-0'>Add Floors Details</h4>
                    </div>
                    {UnitDetailsCount > 0 ?
                        AddFloorsDiv :
                        UnitDetailsCount == 0 ?
                            <>
                                <div className='row py-3 ps-0 text-white'>
                                    <label className='ps-0'>Is this wing similar to any existing wing?</label>
                                    <div className='col-md-4 ps-0 d-flex justify-content-between'>
                                        <div className='text-center pt-2'>
                                            <input type='radio' className='form-check-input cursor-pointer me-2'
                                                name='yes' onChange={(e) => setYesnoRadio(1)} checked={yesnoRadio == 1} />
                                            <label>Yes</label>
                                        </div>
                                        <div className='text-center pt-2'>
                                            <input type='radio' className='form-check-input cursor-pointer me-2'
                                                name='yes' onChange={(e) => setYesnoRadio(2)} checked={yesnoRadio == 2} />
                                            <label>No</label>
                                        </div>
                                    </div>
                                </div>
                                {yesnoRadio == 1 && (
                                    <Formik initialValues={{ selectedwing: '' }}
                                        validateOnBlur={false}
                                        validateOnChange={false}
                                        validationSchema={SelectedWingValidationSchema}
                                        onSubmit={(values) => {
                                            submitSimilarWingDetails(values);
                                        }}>
                                        {({ handleSubmit }) => (
                                            <Form className='pt-2 mt-2 property-form' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                                <div className="row">
                                                    <div className='col-md-12 ps-0 position-relative mb-4'>
                                                        <label className='custom-label font-13'>Select Wing <span className='text-danger'>*</span></label>
                                                        <Field as="select" className="customInput" name='selectedwing' style={{ background: "#03053d", padding: '1em' }}>
                                                            <option value="0" label="Select" />
                                                            {WingsWithData?.length && WingsWithData?.map((item, index) => {
                                                                return <option value={item.id} label={item.name} key={index} />
                                                            })}
                                                        </Field>
                                                        <ErrorMessage name='selectedwing' component="div" className="text-start errorText" />
                                                    </div>
                                                </div>
                                                <div className='pt-3 text-center'>
                                                    <button type="btn" className='px-4 cancelBtn me-2' onClick={(e) => setYesnoRadio(0)}>Cancel</button>
                                                    <button type="submit" className='otpBtn'>Save</button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                )}

                                {yesnoRadio == 2 &&
                                    AddFloorsDiv
                                }
                            </> :
                            null

                    }

                </div>
                :
                <div className='col-md-6 offset-md-2 p-5 pt-3'>
                    <div className='row ps-0 align-items-center'>
                        <h4 className='fontwhite ps-0 fw-bolder mb-0'>Add Floors Details</h4>
                    </div>
                    {AddFloorsDiv}
                </div>
            }

            {PlanPopup && <UpgradePlanPopup show={PlanPopup} onHide={() => setPlanPopup(false)}
                data={planResponse} />}
        </>
    )
}
