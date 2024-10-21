import { Formik } from 'formik';
import React, { useState } from 'react'

export default function AddFloorsUnits() {
    const [FloorUnitDetails, setFloorUnitDetails] = useState({
        totalFloors: 0,
        unitFlag: 1,
        totalUnits: 0,
        unitsArray: []
    })
    const submitFloorUnitDetails = () => {

    }
    return (
        <div className='p-5 pt-3'>
            <div className='row align-items-center'>
                <h4 className='heading mb-0'>Add Floors Details !</h4>
                <p className='font-16 text-white fw-normal'>Heyy, please fill all the informations to proceed further.</p>
            </div>
            <Formik initialValues={FloorUnitDetails}
                enableReinitialize={true}
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={WingsValidationSchema(wingsData.totalWings)}
                onSubmit={(values) => {
                    setFloorUnitDetails(values);
                    submitFloorUnitDetails(values);
                }}>
                {({ values, setFieldValue }) => (
                    <Form className='pt-4 mt-2 property-form' >
                        <div className="row">
                            <div className='col-md-6 position-relative mb-4'>
                                <label className='custom-label'>How many wings in this scheme?*<span className='text-danger'>*</span></label>
                                <Field type="number" className="customInput" name='totalWings' autoComplete='off'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFieldValue('totalWings', value);
                                        handleTotalWingsChange(value);
                                    }} />
                                <ErrorMessage name='totalWings' component="div" className="text-start errorText" />
                            </div>
                        </div>
                        <div className='row'>
                            {values.wingsArray?.map((item, index) => (
                                <div key={index} className='col-md-3 position-relative mb-4'>
                                    <label className='custom-label'>
                                        Wing {index + 1} Name*<span className='text-danger'>*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        className="customInput"
                                        name={`wingsArray[${index}].wingName`}
                                        value={item.wingName}
                                        autoComplete='off'
                                    />
                                    <ErrorMessage name={`wingsArray[${index}].wingName`} component="div" className="text-start errorText" />
                                </div>
                            ))}
                        </div>
                        <div className='pt-3'>
                            <button type="submit" className='otpBtn'>Proceed</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
