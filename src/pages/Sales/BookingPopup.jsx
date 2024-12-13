import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import useApiService from '../../hooks/useApiService';
import Loader from '../../components/loader/Loader';
import DropdownTreeSelectBox from '../../components/suggestionbox/DropdownTreeSelectBox';
import useProperty from '../../hooks/useProperty';
import AlertComp from '../../components/alerts/AlertComp';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropertyBookingValidationSchema } from '../../utils/validations/PropertyBookingValidationSchema';
import useCommonApiService from '../../hooks/useCommonApiService';
import Images from '../../utils/Images';

export default function BookingPopup({ setBookingModel, unitid }) {
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const { getPaymentTypes } = useCommonApiService();
    const { schemeId, refreshPropertyDetails } = useProperty();
    const [Loading, setLoading] = useState(false);
    const [showAlerts, setshowAlerts] = useState(false);
    const [allLeads, setAllLeads] = useState([]);
    const [PaymentTypes, setPaymentTypes] = useState([]);
    const [leadvalue, setLeadvalue] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const today = new Date().toISOString().slice(0, 10);
    const [initialValues, setinitialValues] = useState({
        booking_date: today,
        token_amt: 0,
        payment_due_date: today,
        next_payable_amt: 0,
        contact_name: '',
        contact_number: '',
        contact_email: '',
        lead_id: null,
        bookingpaymenttype: '',
        bookingreferencenumber: '',
        nextpaymenttype: '',
        nextpaymentreferencenumber: '',
        type: '',
        notes: ''
    })
    useEffect(() => {
        setLeadvalue(null);
        setShowForm(false);
        getAllLeads();
        getPayment();
    }, [])
    const getAllLeads = async () => {
        try {
            setLoading(true);
            const result = await getAPIAuthKey(`/get-lead-customer-name-with-detail/${schemeId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            const transformedLeads = responseRs.map(lead => ({
                label: `${lead.name} (${lead.contact_no})`,
                value: lead.id,
                email: lead.email,
                contact_no: lead.contact_no,
                className: lead.entity_type == 2 ? 'highlight-blue' : ''
            }));
            setAllLeads(transformedLeads);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const getPayment = async () => {
        const paymenttypes = await getPaymentTypes();
        setPaymentTypes(paymenttypes);
    }
    const submitBookingDetails = async (values) => {
        setLoading(true);
        var raw = JSON.stringify({
            booking_date: values.booking_date || null,
            token_amt: values.token_amt || null,
            payment_due_date: values.payment_due_date || null,
            next_payable_amt: values.next_payable_amt || null,
            unit_id: unitid,
            entity_id: initialValues.lead_id || null,
            contact_name: values.contact_name || null,
            contact_email: values.contact_email || null,
            contact_number: values.contact_number || null,
            property_id: schemeId,
            bookingpaymenttype: values.bookingpaymenttype || 0,
            bookingreferencenumber: values.bookingreferencenumber || null,
            nextpaymenttype: values.nextpaymenttype || 0,
            nextpaymentreferencenumber: values.nextpaymentreferencenumber || null,
            notes: values.notes || null
        })
        try {
            const result = await postAPIAuthKey('/add-unit-booking-detail', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == 'success') {
                setshowAlerts(<AlertComp show={true} variant="success" message={'Booked Successfully.'} />);
                hidePopup();
                setTimeout(() => {
                    setLoading(false);
                    setshowAlerts(false);
                    refreshPropertyDetails();
                }, 2000);
            }
            else {
                setshowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);

            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleCategoryChange = (selectedLeadId) => {
        const selectedLead = allLeads.find(lead => lead.value == selectedLeadId[0].value);
        setLeadvalue(selectedLeadId);
        setinitialValues({
            ...initialValues,
            lead_id: selectedLead.value,
            contact_name: selectedLead.label,
            contact_number: selectedLead.contact_no,
            contact_email: selectedLead.email,
            type: selectedLead.type
        });
        setShowForm(true)
    };

    const hidePopup = () => {
        setBookingModel(false);
        setLeadvalue(null);
        setShowForm(false);
        refreshPropertyDetails();
    }

    return (
        <div className=''>
            {showAlerts}
            {Loading && <Loader runningcheck={Loading} />}
            <label className='pb-3 font-13 formLabel' style={{ textAlign: "justify" }}>
                You can select an existing lead or customer, or add a new one, to book this unit. Once the booking is confirmed, the customer will be assigned to the unit.
            </label>
            {!showForm ?
                <div className='col-12 d-grid justify-content-center'>
                    <DropdownTreeSelectBox data={allLeads} mode={"radioSelect"} onChange={handleCategoryChange} selectedValue={leadvalue}
                        placeholder={"Choose Lead or Customer"} />
                    <div className='text-center'>
                        <div className='py-3'>OR</div>
                        <button type="btn" className='SuccessBtn' onClick={(e) => {
                            setShowForm(true);
                            setinitialValues({
                                ...initialValues, booking_date: today,
                                token_amt: 0,
                                payment_due_date: null,
                                next_payable_amt: 0,
                                contact_name: '',
                                contact_number: '',
                                contact_email: '',
                                lead_id: null,
                                notes: ''
                            })
                        }}>
                            <img src={Images.addicon} className='bigiconsize h-100 pe-2' />
                            <label className=''>Add Lead/Customer</label>

                        </button>
                    </div>
                </div>
                :
                <Formik initialValues={initialValues}
                    validateOnBlur={false}
                    validateOnChange={false}
                    validationSchema={PropertyBookingValidationSchema}
                    onSubmit={(values) => {
                        setinitialValues(values);
                        submitBookingDetails(values);
                    }}>
                    {({ values, setFieldValue, handleSubmit }) => (
                        <Form className='' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <div className='row'>
                                <div className='col-md-6 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Name <span className='text-danger'>*</span></label>
                                    <Field type="text" className="custom-inputs" name='contact_name' autoComplete='off'
                                        disabled={leadvalue ? true : false} />
                                    <ErrorMessage name='contact_name' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Contact no. <span className='text-danger'>*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text font-13">+91</span>
                                        <Field type="number" disabled={leadvalue ? true : false} className="form-control custom-inputs" name='contact_number' autoComplete='off' />
                                    </div>
                                    <ErrorMessage name='contact_number' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Email (optional)</label>
                                    <Field type="text" className="custom-inputs" name='contact_email' autoComplete='off'
                                        disabled={leadvalue ? true : false} />
                                </div>
                                <div className='col-md-3 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Booking Date</label>
                                    <Field type="date" className="custom-inputs" name='booking_date' autoComplete='off'
                                        onChange={(e) => {
                                            setFieldValue('booking_date', e.target.value);
                                            setFieldValue('payment_due_date', e.target.value)
                                        }} />
                                </div>
                                <div className='col-md-3 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Booking Amount</label>
                                    <div className="input-group">
                                        <Field type="number" min={0} className="form-control custom-inputs" name='token_amt' autoComplete='off'
                                            onChange={(e) => { setinitialValues({ ...initialValues, token_amt: e.target.value }); setFieldValue('token_amt', e.target.value) }} />
                                        <span className="input-group-text inputbg">
                                            <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                                        </span>
                                    </div>
                                </div>
                                <div className='col-md-3 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Payment Type (optional)</label>
                                    <Field as="select" className="custom-inputs" name='bookingpaymenttype'>
                                        <option value="0" label="Select" />
                                        {PaymentTypes?.map((item, index) => {
                                            return <option value={item.id} label={item.name} key={index} />
                                        })}
                                    </Field>
                                </div>
                                <div className='col-md-3 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Reference number (optional)</label>
                                    <Field type="text" className="custom-inputs" name='bookingreferencenumber' autoComplete='off' />
                                </div>
                            </div>
                            {initialValues.token_amt > 0 && (
                                <div className='row'>
                                    <div className='col-md-3 mb-4 ps-0 position-relative'>
                                        <label className='input-labels'>Next Payment Due Date</label>
                                        <Field type="date" className="custom-inputs" name='payment_due_date' autoComplete='off'
                                            min={values.booking_date || ''} />
                                    </div>
                                    <div className='col-md-3 mb-4 ps-0 position-relative'>
                                        <label className='input-labels'>Next Payment Amount</label>
                                        <div className="input-group">
                                            <Field type="number" min={0} className="form-control custom-inputs" name='next_payable_amt' autoComplete='off' />
                                            <span className="input-group-text inputbg">
                                                <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-md-3 mb-4 ps-0 position-relative'>
                                        <label className='input-labels'>Payment Type (optional)</label>
                                        <Field as="select" className="custom-inputs" name='nextpaymenttype'>
                                            <option value="0" label="Select" />
                                            {PaymentTypes?.map((item, index) => {
                                                return <option value={item.id} label={item.name} key={index} />
                                            })}
                                        </Field>
                                    </div>
                                    <div className='col-md-3 mb-4 ps-0 position-relative'>
                                        <label className='input-labels'>Reference number (optional)</label>
                                        <Field type="text" className="custom-inputs" name='nextpaymentreferencenumber' autoComplete='off' />
                                    </div>
                                </div>
                            )}
                            <div className='row ps-0'>
                                <div className='col-md-6 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Notes (optional)</label>
                                    <Field type="textarea" className="custom-inputs" name='notes' autoComplete='off' />
                                </div>
                            </div>


                            <div className='col-12 pt-2 text-center'>
                                <button type="button" className='CancelBtn me-2' onClick={(e) => hidePopup()}>Cancel</button>
                                <button type="submit" className='SuccessBtn'>Save</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            }

        </div>
    )
}