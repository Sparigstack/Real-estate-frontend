import React, { useEffect, useState } from 'react'
import useApiService from '../../hooks/useApiService';
import { formatCurrency, DDMMYYYY, YYYYMMDD } from '../../utils/js/Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import Images from '../../utils/Images';
import { ErrorMessage, Field, Formik } from 'formik';
import { Form } from 'react-bootstrap';
import * as Yup from 'yup';
import AlertComp from '../../components/alerts/AlertComp';
import useCommonApiService from '../../hooks/useCommonApiService';

export default function ViewBookingPopup({ BookingDetails, unitId, setloading, setShowAlerts }) {
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const { getPaymentTypes } = useCommonApiService();
    const [AllData, setAllData] = useState('');
    const today = new Date().toISOString().slice(0, 10);
    const [editableRowIndex, setEditableRowIndex] = useState(null);
    const [PaymentTypes, setPaymentTypes] = useState([]);
    const [ShowPaymentDiv, setShowPaymentDiv] = useState(false);
    const [initialValues, setinitialValues] = useState({
        bookingdate: today,
        amount: '',
        bookingreferencenumber: '',
        bookingpaymenttype: ''
    });
    const [editedPayment, setEditedPayment] = useState({
        date: '',
        amount: '',
        payment_type: '',
        bookingreferencenumber: '',
        bookingpaymenttype: ''
    });

    useEffect(() => {
        getBookingDetails();
        getPayment();
    }, [])

    const getPayment = async () => {
        const paymenttypes = await getPaymentTypes();
        setPaymentTypes(paymenttypes);
    }

    const getBookingDetails = async () => {
        try {
            const result = await getAPIAuthKey(`/get-booked-unit-detail/${unitId}/${BookingDetails?.userid}/${BookingDetails?.bookingtype}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setAllData(responseRs.data);
        }
        catch (error) {
            setloading(false);
            console.error(error);
        }
    }

    const submitPaymentDetails = async (values) => {
        setloading(true);
        try {
            const raw = JSON.stringify({
                amount: values.amount,
                date: DDMMYYYY(values.bookingdate),
                unit_id: unitId,
                payment_id: null,
                bookingreferencenumber: values.bookingreferencenumber || null,
                bookingpaymenttype: values.bookingpaymenttype || 0,
                userid: BookingDetails?.userid
            });
            const result = await postAPIAuthKey('/add-unit-payment-detail', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setloading(false);
                    setEditableRowIndex(null);
                    setShowPaymentDiv(false)
                    getBookingDetails();
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                    }, 2000);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const PaymentValidationSchema = Yup.object().shape({
        bookingdate: Yup.date().required('Payment date is required').typeError('Please enter a valid date'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('Must be greater than 0')
            .integer('Must be an integer')
            .nullable(),
    });

    const SavePayment = async (paymentid) => {
        setloading(true);
        try {
            const raw = JSON.stringify({
                amount: editedPayment.amount,
                date: DDMMYYYY(editedPayment.date),
                unit_id: unitId,
                payment_id: paymentid,
                bookingreferencenumber: editedPayment.bookingreferencenumber || null,
                bookingpaymenttype: editedPayment.bookingpaymenttype || 0,
                userid: BookingDetails?.userid
            });
            const result = await postAPIAuthKey('/add-unit-payment-detail', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setloading(false);
                    setEditableRowIndex(null);
                    getBookingDetails();
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                    }, 2000);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditRow = (index, item) => {
        setEditableRowIndex(index);
        setEditedPayment({
            date: YYYYMMDD(item.payment_due_date),
            amount: item.next_payable_amt,
            bookingreferencenumber: item.reference_number,
            bookingpaymenttype: item.type_id
        });
    };

    const handleEditChange = (field, value) => {
        setEditedPayment((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    return (
        <>

            <div className='row pb-4 font-13 formLabel'>
                <div className='col-md-6'>
                    <div className='fw-bold font-14'>Unit Details</div>
                    <div className='white_boxes mt-2'>
                        <div className='row align-items-center pb-2 justify-content-between'>
                            <div className='fw-semibold col-md-6'>Unit Name</div>
                            <div className='col-md-6'>: &nbsp; {AllData?.unit_details?.wing_name}{AllData?.unit_details?.wing_name && '-'}{AllData?.unit_details?.unit_name}</div>
                        </div>
                        <div className='row align-items-center pb-2 justify-content-between'>
                            <div className='fw-semibold col-md-6'>Unit Size</div>
                            <div className='col-md-6'>: &nbsp; {AllData?.unit_details?.unit_size || 0} sq.ft</div>
                        </div>
                        <div className='row align-items-center justify-content-between'>
                            <div className='fw-semibold col-md-6'>Unit Amount</div>
                            <div className='col-md-6'>: &nbsp; {AllData?.unit_details?.unit_price ? formatCurrency(AllData?.unit_details?.unit_price) : 0}
                                <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1 font-13' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='fw-bold font-14'>Customer Details</div>
                    <div className='white_boxes mt-2'>
                        <div className='row align-items-center pb-2 justify-content-between'>
                            <div className='fw-semibold col-md-5'>Customer Name</div>
                            <div className='col-md-7'>: &nbsp; {AllData.contact_name}</div>
                        </div>
                        <div className='row align-items-center pb-2 justify-content-between'>
                            <div className='fw-semibold col-md-5'>Email</div>
                            <div className='col-md-7' style={{ wordBreak: "break-all" }}>: &nbsp; {AllData.contact_email || '-'}</div>
                        </div>
                        <div className='row align-items-center justify-content-between'>
                            <div className='fw-semibold col-md-5'>Contact Number</div>
                            <div className='col-md-7'>: &nbsp; {AllData.contact_number}</div>
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='white_boxes mt-2 d-flex'>
                        <div className='fw-semibold'>Notes</div>
                        <div className=''>: &nbsp; {AllData.notes || '-'}</div>
                    </div>
                </div>
            </div>
            <div className='col-12 font-14 formLabel'>
                <h6 className='fw-semibold'>Payment Summary</h6>
                <table className='table paymentsummary'>
                    <thead className='table-header'>
                        <tr>
                            <th scope="col">Payment Type</th>
                            <th scope="col">Reference No.</th>
                            <th scope="col">Date</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AllData?.payment_schedule?.length > 0 ?
                            AllData.payment_schedule.map((item, index) => {
                                return (
                                    item.next_payable_amt && (
                                        <tr key={index} className={`${item.payment_status == 1 && 'PaymentTable'} font-13`}>
                                            <td scope="col">
                                                {editableRowIndex == index ?
                                                    <select className="custom-inputs" defaultValue={item.type_id} onChange={(e) => handleEditChange("bookingpaymenttype", e.target.value)} >
                                                        <option value="0" label="Select" />
                                                        {PaymentTypes?.map((item, index) => {
                                                            return <option value={item.id} label={item.name} key={index} />
                                                        })}
                                                    </select>
                                                    :
                                                    item.type || '-'
                                                }
                                            </td>
                                            <td scope="col">
                                                {editableRowIndex == index ?
                                                    <input type="text" className="custom-inputs" name='bookingreferencenumber' autoComplete='off'
                                                        defaultValue={item.reference_number} onChange={(e) => handleEditChange("bookingreferencenumber", e.target.value)} />
                                                    :
                                                    item.reference_number || '-'
                                                }
                                            </td>
                                            <td scope="col">
                                                {editableRowIndex == index ? (
                                                    <input type="date" className="custom-inputs" name='bookingdate'
                                                        defaultValue={YYYYMMDD(item.payment_due_date)} onChange={(e) => handleEditChange("date", e.target.value)} />
                                                ) : (
                                                    DDMMYYYY(item.payment_due_date)
                                                )}
                                            </td>
                                            <td scope="col">
                                                {editableRowIndex == index ? (
                                                    <div className="input-group">
                                                        <input type="number" min={0} className="form-control custom-inputs" name='amount'
                                                            defaultValue={item.next_payable_amt} onChange={(e) => handleEditChange("amount", e.target.value)} />
                                                        <span className="input-group-text inputbg">
                                                            <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {item.next_payable_amt && formatCurrency(item.next_payable_amt)}
                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1 font-13' />
                                                    </>
                                                )}
                                            </td>
                                            {item.payment_status == 1 ?
                                                <td scope="col" className='font-12'>
                                                    <label>Pending</label>
                                                    {editableRowIndex === index ?
                                                        <>
                                                            <img src={Images.orange_save} className='ps-1  cursor-pointer' style={{ height: "12px" }} title="Save Due Payment"
                                                                onClick={() => SavePayment(item.payment_id)} />
                                                            <img src={Images.orange_cancel} className='ps-1 cursor-pointer' style={{ height: "16px" }} title="Cancel"
                                                                onClick={() => setEditableRowIndex(null)} />
                                                        </>
                                                        :
                                                        <img src={Images.log_payment} className='ps-2  cursor-pointer' title="Log this Payment"
                                                            onClick={() => handleEditRow(index, item)} />
                                                    }

                                                </td>
                                                :
                                                <td scope="col " className=''>
                                                    <label>Completed</label>
                                                </td>
                                            }
                                        </tr>
                                    )
                                )
                            })
                            :
                            <tr>
                                <td colSpan="5" className='text-center'>
                                    Awaiting Payments
                                </td>
                            </tr>
                        }
                        {AllData?.payment_schedule?.length > 0 && (
                            <tr>
                                <td colSpan="3" className='text-center' style={{ border: 'none', background: "transparent" }}>
                                </td>
                                <td className='CompletedAmount font-13'>{formatCurrency(AllData?.total_paid_amount)}<FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1 font-13' /></td>
                                <td className='CompletedAmount font-13'>Total Completed</td>
                            </tr>
                        )}

                    </tbody>
                </table>
                {AllData?.payment_schedule?.length > 0 ?
                    <label className='text-decoration-underline cursor-pointer fw-semibold formlabel '
                        onClick={(e) => {
                            setShowPaymentDiv(true); setinitialValues({
                                ...initialValues,
                                bookingdate: today, amount: '', bookingreferencenumber: '', bookingpaymenttype: ''
                            })
                        }}>Add Due / Next Payment</label>
                    :
                    <label className='text-decoration-underline cursor-pointer fw-semibold formlabel'
                        onClick={(e) => {
                            setShowPaymentDiv(true); setinitialValues({
                                ...initialValues,
                                bookingdate: today, amount: '', bookingreferencenumber: '', bookingpaymenttype: ''
                            })
                        }}>Add Down Payment</label>
                }
                {ShowPaymentDiv && (
                    <Formik initialValues={initialValues}
                        validateOnBlur={false}
                        validateOnChange={false}
                        validationSchema={PaymentValidationSchema}
                        onSubmit={(values) => {
                            setinitialValues(values);
                            submitPaymentDetails(values);
                        }}>
                        {({ handleSubmit, setFieldValue }) => (
                            <Form className='row pt-4 align-items-center' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <div className='col-md-3 mb-3 ps-0 position-relative'>
                                    <label className='input-labels'>Payment Type (optional)</label>
                                    <Field as="select" className="custom-inputs" name='bookingpaymenttype'>
                                        <option value="0" label="Select" />
                                        {PaymentTypes?.map((item, index) => {
                                            return <option value={item.id} label={item.name} key={index} />
                                        })}
                                    </Field>
                                </div>
                                <div className='col-md-3 mb-3 ps-0 position-relative'>
                                    <label className='input-labels'>Reference No. (optional)</label>
                                    <Field type="text" className="custom-inputs" name='bookingreferencenumber' autoComplete='off' />
                                </div>
                                <div className='col-md-3 mb-3 ps-0 position-relative'>
                                    <label className='input-labels'>Payment Date<span className='text-danger'>*</span></label>
                                    <Field type="date" className="custom-inputs" name='bookingdate' autoComplete='off' />
                                    <ErrorMessage name='bookingdate' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-md-3 mb-3 ps-0 position-relative'>
                                    <label className='input-labels'>Payment Amount<span className='text-danger'>*</span></label>
                                    <div className="input-group">
                                        <Field type="number" min={0} className="form-control custom-inputs" name='amount' autoComplete='off'
                                            onChange={(e) => { setinitialValues({ ...initialValues, amount: e.target.value }); setFieldValue('amount', e.target.value) }} />
                                        <span className="input-group-text inputbg">
                                            <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                                        </span>
                                    </div>
                                    <ErrorMessage name='amount' component="div" className="text-start errorText" />
                                </div>
                                <div className='col-3 offset-md-9'>
                                    {formatCurrency(initialValues.amount)}  {initialValues.amount && <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />}
                                </div>
                                <div className='col-md-12 my-3 text-center'>
                                    <button type="submit" className='SuccessBtn'>Save</button>
                                    <button type="button" className='CancelBtn ms-2' onClick={(e) => setShowPaymentDiv(false)}>Cancel</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div >
        </>
    )
}
