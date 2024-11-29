import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import { PropertyBookingValidationSchema } from '../../../utils/validations/PropertyBookingValidationSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import useApiService from '../../../hooks/useApiService';
import { PropertyCustomerValidationSchema } from '../../../utils/validations/PropertyCustomerValidationSchema';

export default function CustomerForm({ initialValues, setinitialValues, setScanChequeModal, leadvalue, leadData, WingDetails }) {
    const [allUnits, setAllUnits] = useState([])
    const { getAPIAuthKey } = useApiService();
    const [existingOwners, setExistingOwners] = useState('')
    const [showExistingMsg, setShowExistingMsg] = useState(false)
    const [ExistingOwnerFlag, setExistingOwnerFlag] = useState(1)
    const [unitDetails, setunitDetails] = useState({
        wingname: '',
        unitname: ''
    })
    const handleWingChange = async (wingId) => {
        const selectedWing = WingDetails?.wingsArray?.find(item => item.wing_id == wingId);
        setunitDetails((prevdata) => ({
            ...prevdata,
            wingname: selectedWing ? selectedWing.wing_name : ''
        }));
        try {
            const result = await getAPIAuthKey(`/get-unit-wing-wise/${wingId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setAllUnits(responseRs);
        }
        catch (error) {
            setloading(false);
            console.error(error);
        }
    };

    const submitBookingDetails = async (values) => {
        const raw = JSON.stringify({
            contact_name: values.contact_name,
            contact_number: values.contact_number,
            contact_email: values.contact_email,
            amount: leadData.amount,
            lead_id: leadvalue,
            unit_id: values.unit,
            wing_id: values.wing,
        })
    }
    return (
        <Formik initialValues={initialValues}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={PropertyCustomerValidationSchema}
            onSubmit={(values) => {
                setinitialValues(values);
                submitBookingDetails(values);
            }}>
            {({ setFieldValue, handleSubmit }) => (
                <Form className='row text-start' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className='col-md-6 mb-3'>
                        <label className='font-13 formLabel'>Contact Name <span className='text-danger'>*</span></label>
                        <Field type="text" className="form-control font-14" name='contact_name' autoComplete='off'
                            disabled={leadvalue ? true : false} />
                        <ErrorMessage name='contact_name' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label className='font-13 formLabel'>Contact Number <span className='text-danger'>*</span></label>
                        <Field type="number" min={0} className="form-control font-14" name='contact_number' autoComplete='off'
                            disabled={leadvalue ? true : false} />
                        <ErrorMessage name='contact_number' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label className='font-13 formLabel'>Contact Email <span className='text-danger'>*</span></label>
                        <Field type="text" className="form-control font-14" name='contact_email' autoComplete='off'
                            disabled={leadvalue ? true : false} />
                        <ErrorMessage name='contact_email' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-3'>
                        <label className='font-13 formLabel'>Total Amount <span className='text-danger'>*</span></label>
                        <div className="input-group">
                            <Field type="text" min={0} className="form-control font-14" name='total_amount' autoComplete='off'
                                readOnly value={leadData.amount || 0} />
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                            </span>
                        </div>
                        <ErrorMessage name='total_amount' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-3 text-start'>
                        <label className='font-13 formLabel'>Select Wing <span className='text-danger'>*</span></label>
                        <Field as="select" className="form-control p-2" name='wing' value={unitDetails.wing}
                            onChange={(e) => { setFieldValue('wing', e.target.value); handleWingChange(e.target.value) }}>
                            <option value="0" label="Select" />
                            {WingDetails?.wingsArray?.length &&
                                WingDetails?.wingsArray?.map((item, index) => {
                                    return <option value={item.wing_id} label={item.wing_name} key={index} />
                                })}
                        </Field>
                        <ErrorMessage name='wing' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-3 text-start'>
                        <label className='font-13 formLabel'>Select Unit <span className='text-danger'>*</span></label>
                        <Field as="select" className="form-control p-2" value={unitDetails.unit} name='unit'
                            onChange={(e) => {
                                const selectedUnit = allUnits.find(unit => unit.id == e.target.value);
                                const unitName = selectedUnit ? selectedUnit.name : '';
                                setFieldValue('unit', e.target.value);
                                setunitDetails(prevData => ({
                                    ...prevData,
                                    unitname: unitName
                                }));
                            }}>
                            <option value="0" label="Select" />
                            {allUnits.length && allUnits?.map((item, index) => {
                                return <option value={item.id} label={item.name} key={index} />
                            })}
                        </Field>
                        <ErrorMessage name='unit' component="div" className="text-start errorText" />
                    </div>
                    {showExistingMsg && (
                        <div className='pt-2 pb-3'>
                            <label className='text-danger font-13'>
                                This unit ({unitDetails.wingname}-{unitDetails.unitname}) is currently booked under {existingOwners}.
                                The selected person differs from the existing owner.<br />
                                Would you like to apply this payment to {existingOwners}, or select a different unit?
                            </label>
                            <div className='pt-2 d-flex justify-content-evenly '>
                                <div className="pb-1">
                                    <input
                                        className="form-check-input me-2"
                                        type="radio"
                                        name="ExistingOwner"
                                        defaultChecked={ExistingOwnerFlag == 2}
                                        onChange={(e) => setExistingOwnerFlag(2)}
                                    />
                                    <label className="form-check-label font-13">Payment to {existingOwners}</label>
                                </div>
                                <div className="pb-1">
                                    <input
                                        className="form-check-input me-2"
                                        type="radio"
                                        name="ExistingOwner"
                                        defaultChecked={ExistingOwnerFlag == 3}
                                        onChange={(e) => setExistingOwnerFlag(3)}
                                    />
                                    <label className="form-check-label font-13">Select Different Unit</label>
                                </div>
                            </div>
                            {ExistingOwnerFlag == 3 && (
                                <label className='py-2'>Please select a unit from the dropdown above to apply this payment.</label>
                            )}
                        </div>
                    )}
                    <div className='col-12 pt-2 text-center'>
                        <button type="button" className='CancelBtn me-2' onClick={(e) => setScanChequeModal(false)}>Cancel</button>
                        <button type="submit" className='SuccessBtn'>Save</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
