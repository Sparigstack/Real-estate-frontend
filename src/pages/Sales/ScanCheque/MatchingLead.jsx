import React, { useState } from 'react'
import Images from '../../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap'
import { ErrorMessage, Field, Formik } from 'formik'
import * as Yup from 'yup';
import useApiService from '../../../hooks/useApiService'
import useProperty from '../../../hooks/useProperty'
import AlertComp from '../../../components/alerts/AlertComp'

export default function MatchingLead({ leadData, setScanChequeModal, WingDetails, setloading, setShowAlerts }) {
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const { schemeId, refreshPropertyDetails } = useProperty();
    const [selectedLead, setselectedLead] = useState(null)
    const [leadType, setleadType] = useState(null)
    const [allUnits, setAllUnits] = useState([])
    const [existingOwners, setExistingOwners] = useState('')
    const [showExistingMsg, setShowExistingMsg] = useState(false)
    const [ExistingOwnerFlag, setExistingOwnerFlag] = useState(1)
    const extractedAmount = leadData?.amount?.match(/[\d,]+(\.\d{2})?/)[0];
    const [unitDetails, setunitDetails] = useState({
        wing: '',
        unit: '',
        wingname: '',
        unitname: ''
    })
    const ScanChequeValidationSchema = Yup.object().shape({
        wing: Yup.number().required('Wing is required').notOneOf([0], 'Please Select a valid Wing'),
        unit: Yup.number().required('Unit is required').notOneOf([0], 'Please Select a valid Unit'),
    });
    const submitChequeDetails = async (values) => {
        const raw = JSON.stringify({
            property_id: schemeId,
            unit_id: values.unit,
            wing_id: values.wing,
            id: selectedLead,
            lead_type: leadType,
            amount: extractedAmount,
            flag: ExistingOwnerFlag
        })
        try {
            setloading(true)
            const result = await postAPIAuthKey('/add-matched-entity-using-cheque', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setShowExistingMsg(false)
            if (responseRs.status == "success") {
                setloading(false)
                setShowAlerts(<AlertComp show={true} variant="success" message="Amount Added Successfully." />);
                setScanChequeModal(false);
                refreshPropertyDetails();
                setTimeout(() => {
                    setShowAlerts(false);
                }, 2500);
            }
            else if (responseRs.status == "matched") {
                setloading(false)
                setExistingOwners(responseRs.names);
                setShowExistingMsg(true);
            }
            else {
                setloading(false)
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => setShowAlerts(false), 2000);
            }
        } catch (error) {
            setloading(false)
            console.log('error', error);
        }
    }
    const handleWingChange = async (wingId) => {
        const selectedWing = WingDetails?.wingsArray?.find(item => item.wing_id == wingId);
        setunitDetails((prevdata) => ({
            ...prevdata,
            wing: wingId,
            wingname: selectedWing ? selectedWing.wing_name : ''
        }));
        try {
            setloading(true);
            const result = await getAPIAuthKey(`/get-unit-wing-wise/${wingId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setAllUnits(responseRs);
            setloading(false);
        }
        catch (error) {
            setloading(false);
            console.error(error);
        }
    };

    const handleLeadSelection = (lead) => {
        setselectedLead(lead.id);
        setleadType(lead.lead_type);
        if (lead.unitMatches && lead.unitMatches.length > 0) {
            const wingId = lead.unitMatches[0].wing_id;
            handleWingChange(wingId);
            setunitDetails({
                wing: wingId,
                unit: lead.unitMatches[0].unit_id,
                wingname: lead.unitMatches[0].wing_name,
                unitname: lead.unitMatches[0].unit_name
            });
        } else {
            setAllUnits([]);
            setunitDetails({
                wing: '0',
                unit: '0',
                wingname: '',
                unitname: ''
            });
        }

    }
    return (
        <div className='row py-2'>
            <div className='col-12 d-flex align-items-center justify-content-center'>
                <img src={Images.true_found} className='bigiconsize pe-2' />
                <label>
                    {leadData?.MatchingData?.length} Lead Data Found
                </label>
            </div>
            <div className='my-2'>
                <div className='formLabel matchingleadsboxes py-3 text-start'>
                    <div className='row font-14 pb-1'>
                        <div className='col-md-1'></div>
                        <div className='col-md-3'>Contact Name</div>
                        <div className='col-md-2'>Contact No.</div>
                        <div className='col-md-3'>Email</div>
                        <div className='col-md-3'>Amount</div>
                    </div>
                    {leadData?.MatchingData?.length > 0 && (
                        leadData?.MatchingData?.map((item, index) => {
                            return <div className='row font-13' key={index}>
                                <div className='col-md-1 text-center pt-2'>
                                    <input type='radio' className='form-check-input cursor-pointer'
                                        name='leadselection' onChange={(e) => handleLeadSelection(item)} />
                                </div>
                                <div className='col-md-3 pe-0'>
                                    <div className='matchingleadsboxes'>
                                        {item.name}
                                    </div>
                                </div>
                                <div className='col-md-2 pe-0'>
                                    <div className='matchingleadsboxes'>
                                        {item.contact_no}
                                    </div>
                                </div>
                                <div className='col-md-3 pe-0'>
                                    <div className='matchingleadsboxes'>
                                        {item.email}
                                    </div>
                                </div>
                                <div className='col-md-3 pb-2'>
                                    <div className="input-group">
                                        <input type="text" className="form-control font-13 p-1 formLabel" name='amount' readOnly
                                            value={extractedAmount} />
                                        <span className="input-group-text">
                                            <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        })
                    )}

                </div>
            </div>

            {selectedLead && (
                <Formik initialValues={unitDetails}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={ScanChequeValidationSchema}
                    onSubmit={(values) => {
                        setunitDetails(values);
                        submitChequeDetails(values);
                    }}>
                    {({ handleSubmit, setFieldValue, resetForm }) => (
                        <Form className='pt-2 mt-2 property-form' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <div className='row'>
                                <div className='col-md-4 offset-md-2 mb-4 text-start'>
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
                                <div className='col-md-4 mb-4 text-start'>
                                    <label className='font-13 formLabel'>Select Unit <span className='text-danger'>*</span></label>
                                    <Field as="select" className="form-control p-2" value={unitDetails.unit} name='unit'
                                        onChange={(e) => {
                                            const selectedUnit = allUnits.find(unit => unit.id == e.target.value);
                                            const unitName = selectedUnit ? selectedUnit.name : '';
                                            setFieldValue('unit', e.target.value);
                                            setFieldValue('unitname', unitName);
                                            setunitDetails(prevData => ({
                                                ...prevData,
                                                unit: e.target.value,
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
                                <div className='text-center'>
                                    <button type="button" className='CancelBtn me-2' onClick={(e) => { resetForm(); setScanChequeModal(false) }}>Cancel</button>
                                    <button type="submit" className='SuccessBtn'>Save</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    )
}
