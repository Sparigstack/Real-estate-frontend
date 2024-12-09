import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import AddUpdateLeadValidationSchema from '../utils/validations/AddUpdateLeadValidationSchema';
import useCommonApiService from '../hooks/useCommonApiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

export default function LeadForm({ formData, setFormData, handleAddLead, handleHide, showBudget }) {
    const { getSources, getLeadStatus } = useCommonApiService();
    const [sourcesData, setsourcesData] = useState([]);
    const [leadStatuses, setleadStatuses] = useState([]);
    useEffect(() => {
        const fetchSources = async () => {
            const sources = await getSources();
            setsourcesData(sources)
        }
        const fetchStatus = async () => {
            const sources = await getLeadStatus();
            setleadStatuses(sources)
        }
        fetchSources();
        fetchStatus();
    }, []);
    return (
        <Formik initialValues={formData}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={AddUpdateLeadValidationSchema}
            enableReinitialize={true}
            onSubmit={(values) => {
                setFormData(values);
                handleAddLead(values);
            }}>
            {({ values, resetForm, setFieldValue }) => (
                <Form className='row'>
                    <div className='col-md-6 mb-4 ps-0 position-relative'>
                        <label className='input-labels'>Name <span className='text-danger'>*</span></label>
                        <Field type="text" className="custom-inputs" name='name' autoComplete='off' />
                        <ErrorMessage name='name' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-4 ps-0 position-relative'>
                        <label className='input-labels'>Contact no. <span className='text-danger'>*</span></label>
                        <div className="input-group">
                            <span className="input-group-text  font-13">+91</span>
                            <Field type="text" className="form-control custom-inputs" name='contactno' autoComplete='off' />
                        </div>
                        <ErrorMessage name='contactno' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-4 ps-0 position-relative'>
                        <label className='input-labels'>Source <span className='text-danger'>*</span></label>
                        <Field as="select" className="custom-inputs" name='source' onChange={(e) => setFieldValue('source', e.target.value)}>
                            <option value="0" label="Select source" />
                            {sourcesData?.map((item, index) => {
                                return <option value={item.id} label={item.name} key={index} />
                            })}
                        </Field>
                        <ErrorMessage name='source' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-4 ps-0 position-relative'>
                        <label className='input-labels'>Status <span className='text-danger'>*</span></label>
                        <Field as="select" className="custom-inputs" name='status' onChange={(e) => setFieldValue('status', e.target.value)}>
                            <option value="0" label="Select status" />
                            {leadStatuses?.map((item, index) => {
                                return <option value={item.id} label={item.name} key={index} />
                            })}
                        </Field>
                        <ErrorMessage name='status' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-md-6 mb-4 ps-0 position-relative'>
                        <label className='input-labels'>Email (optional)</label>
                        <Field type="text" className="custom-inputs" name='email' autoComplete='off' />
                    </div>
                    {values.source == "5" && (
                        <>
                            <div className='col-md-6 mb-4 ps-0 position-relative'>
                                <label className='input-labels'>Agent Name (optional)</label>
                                <Field type="text" className="custom-inputs" name='agent_name' autoComplete='off' />
                            </div>
                            <div className='col-md-6 mb-4 ps-0 position-relative'>
                                <label className='input-labels'>Agent Contact no. (optional)</label>
                                <div className="input-group">
                                    <span className="input-group-text  font-13">+91</span>
                                    <Field type="text" className="form-control custom-inputs" name='agent_contact' autoComplete='off' />
                                </div>
                            </div>
                        </>
                    )}
                    {showBudget && (
                        <div className='col-md-6 mb-4 ps-0 position-relative'>
                            <label className='input-labels'>Budget(optional)</label>
                            <div className="input-group">
                                <Field type="number" min={0} className="form-control custom-inputs" name='budget' autoComplete='off' />
                                <span className="input-group-text inputbg">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-13' />
                                </span>
                            </div>
                        </div>
                    )}
                    <div className='col-md-12 mb-4 ps-0 position-relative'>
                        <label className='input-labels'>Notes (optional)</label>
                        <Field type="textarea" className="custom-inputs" name='notes' autoComplete='off' />
                    </div>
                    <div className='col-12 pt-2 text-center'>
                        <button type='button' className="CancelBtn me-2" onClick={(e) => { resetForm(); handleHide(resetForm) }}>
                            Cancel
                        </button>
                        <button type='submit' className="SuccessBtn">
                            Save
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
