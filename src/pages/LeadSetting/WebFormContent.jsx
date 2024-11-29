import React, { useEffect, useRef, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik';
import AddUpdateLeadValidationSchema from '../../utils/validations/AddUpdateLeadValidationSchema';
import { useParams } from 'react-router-dom';
import AlertComp from '../../components/alerts/AlertComp';
import useApiService from '../../hooks/useApiService';
import useCommonApiService from '../../hooks/useCommonApiService';
import ReCAPTCHA from 'react-google-recaptcha';

export default function WebFormContent() {
    const recaptcharef = useRef();
    const captchasitekey = import.meta.env.VITE_CAPTCHA_SITEKEY;
    const { postAPI } = useApiService();
    const { getSources, getLeadStatus } = useCommonApiService();
    const { schemeId } = useParams();
    const [sourcesData, setsourcesData] = useState([]);
    const [leadStatusData, setleadStatusData] = useState([]);
    const [alerts, setShowAlerts] = useState('');
    useEffect(() => {
        const fetchSources = async () => {
            const sources = await getSources();
            setsourcesData(sources)
        }
        const fetchLeadStatus = async () => {
            const sources = await getLeadStatus();
            setleadStatusData(sources)
        }
        fetchSources();
        fetchLeadStatus();
    }, []);
    const handleAddLead = async (values, token, resetForm) => {
        try {
            const raw = JSON.stringify({
                ...values,
                propertyinterest: schemeId,
                grecaptcha: token
            });
            const result = await postAPI('/web-form-lead', raw);

            if (!result) {
                throw new Error('Something went wrong');
            }

            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                setShowAlerts(<AlertComp show={true} variant="success" message={'Lead Added Successfully'} />);
                setTimeout(() => {
                    setShowAlerts(false);
                    resetForm();
                }, 2000);
            }
            else {
                recaptcharef.current.reset();
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => {
                    setShowAlerts(false);
                }, 2000);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleSubmit = async (values, { resetForm }) => {
        const token = await recaptcharef.current.execute();
        handleAddLead(values, token, resetForm); // Pass resetForm to handleAddLead
    };
    return (
        <div className='row'>
            {alerts}
            <Formik initialValues={{
                name: '',
                email: '',
                source: 0,
                contactno: '',
                notes: ''
            }}
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={AddUpdateLeadValidationSchema}
                onSubmit={handleSubmit}>
                {({ values, handleReset, setFieldValue }) => (
                    <Form className='p-4'>
                        <h3 className='text-center'>Add Lead</h3>
                        <div className='col-md-12 mb-4 ps-0 position-relative'>
                            <label className='input-labels' style={{ backgroundColor: "white" }}>Name <span className='text-danger'>*</span></label>
                            <Field type="text" className="custom-inputs" name='name' autoComplete='off' />
                            <ErrorMessage name='name' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-12 mb-4 ps-0 position-relative'>
                            <label className='input-labels' style={{ backgroundColor: "white" }}>Contact no. <span className='text-danger'>*</span></label>
                            <div className="input-group">
                                <span className="input-group-text  font-13">+91</span>
                                <Field type="text" className="form-control custom-inputs" name='contactno' autoComplete='off' />
                            </div>
                            <ErrorMessage name='contactno' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-12 mb-4 ps-0 position-relative'>
                            <label className='input-labels' style={{ backgroundColor: "white" }}>Source <span className='text-danger'>*</span></label>
                            <Field as="select" className="custom-inputs" name='source' onChange={(e) => setFieldValue('source', e.target.value)}>
                                <option value="0" label="Select source" />
                                {sourcesData?.map((item, index) => {
                                    return <option value={item.id} label={item.name} key={index} />
                                })}
                            </Field>
                            <ErrorMessage name='source' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-12 mb-4 ps-0 position-relative'>
                            <label className='input-labels'>Status <span className='text-danger'>*</span></label>
                            <Field as="select" className="custom-inputs" name='status' onChange={(e) => setFieldValue('status', e.target.value)}>
                                <option value="0" label="Select status" />
                                {leadStatusData?.map((item, index) => {
                                    return <option value={item.id} label={item.name} key={index} />
                                })}
                            </Field>
                            <ErrorMessage name='status' component="div" className="text-start errorText" />
                        </div>
                        {values.source == "5" && (
                            <>
                                <div className='col-md-12 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Agent Name (optional)</label>
                                    <Field type="text" className="custom-inputs" name='agent_name' autoComplete='off' />
                                </div>
                                <div className='col-md-12 mb-4 ps-0 position-relative'>
                                    <label className='input-labels'>Agent Contact no. (optional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text  font-13">+91</span>
                                        <Field type="text" className="form-control custom-inputs" name='agent_contact' autoComplete='off' />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className='col-md-12 mb-4 ps-0 position-relative'>
                            <label className='input-labels' style={{ backgroundColor: "white" }}>Email(optional)</label>
                            <Field type="email" className="custom-inputs" name='email' autoComplete='off' />
                            <ErrorMessage name='email' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-12 mb-4 ps-0 position-relative'>
                            <label className='input-labels' style={{ backgroundColor: "white" }}>Notes (optional)</label>
                            <Field type="textarea" className="custom-inputs" name='notes' autoComplete='off' />
                        </div>

                        <div className='col-12 pt-3 text-center' >
                            <button type='button' className="CancelBtn me-2" onClick={handleReset}>
                                Reset
                            </button>
                            <button type='submit' className="SuccessBtn">
                                Confirm
                            </button>
                        </div>
                        <div className='pt-5'>
                            <ReCAPTCHA ref={recaptcharef} sitekey={captchasitekey} size="invisible" />
                        </div>
                    </Form>
                )}

            </Formik>
        </div>
    )
}
