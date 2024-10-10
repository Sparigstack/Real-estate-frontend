import React, { useEffect, useRef, useState } from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik';
import AddUpdateLeadValidationSchema from '../../utils/validations/AddUpdateLeadValidationSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import AlertComp from '../../components/alerts/AlertComp';
import useApiService from '../../hooks/useApiService';
import useCommonApiService from '../../hooks/useCommonApiService';
import ReCAPTCHA from 'react-google-recaptcha';

export default function WebFormContent() {
    const recaptcharef = useRef();
    const captchasitekey = import.meta.env.VITE_CAPTCHA_SITEKEY;
    const { postAPI } = useApiService();
    const { getSources } = useCommonApiService();
    const { propertyId } = useParams();
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        source: 0,
        budget: '',
        contactno: ''
    });
    const [sourcesData, setsourcesData] = useState([]);
    const [alerts, setShowAlerts] = useState('');
    useEffect(() => {
        const fetchSources = async () => {
            const sources = await getSources();
            setsourcesData(sources)
        }
        fetchSources();
    }, []);
    const handleAddLead = async (values) => {
        try {
            const raw = JSON.stringify({
                ...values,
                propertyinterest: propertyId,
                leadid: formData.leadid,
                captcha: recaptchaToken
            });
            const result = await postAPI('/web-form-lead', raw);

            if (!result) {
                throw new Error('Something went wrong');
            }

            const responseRs = JSON.parse(result);
            if (responseRs.status == 'success') {
                setShowAlerts(<AlertComp show={true} variant="success" message={'Lead Added Successfully'} />);
                setTimeout(() => {
                    setShowAlerts(<AlertComp show={false} />);
                    setFormData({
                        ...formData, name: '',
                        email: '',
                        source: 0,
                        budget: '',
                        contactno: ''
                    })
                }, 2000);
            }
            else {
                recaptcharef.current.reset();
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.msg} />);
                setTimeout(() => {
                    setShowAlerts(<AlertComp show={false} />);
                }, 2000);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleRecaptcha = (token) => {
        setRecaptchaToken(token);
    };
    return (
        <div className='col-12'>
            {alerts}
            <Formik initialValues={formData}
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={AddUpdateLeadValidationSchema}
                onSubmit={(values) => {
                    setFormData(values);
                    handleAddLead(values);
                }}>
                {(resetForm) => (
                    <Form className='row p-4'>
                        <h3 className='text-center'>Add Lead</h3>
                        <div className='col-md-4 py-2'>
                            <label className='font-13'>Name <span className='text-danger'>*</span></label>
                            <Field type="text" className="form-control" name='name' autoComplete='off' />
                            <ErrorMessage name='name' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-4 pb-2'>
                            <label className='font-13'>Email <span className='text-danger'>*</span></label>
                            <Field type="email" className="form-control" name='email' autoComplete='off' />
                            <ErrorMessage name='email' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-4 pb-2'>
                            <label className='font-13'>Contact no. <span className='text-danger'>*</span></label>
                            <Field type="text" className="form-control" name='contactno' autoComplete='off' />
                            <ErrorMessage name='contactno' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-4 py-2'>
                            <label className='font-13'>Budget <span className='text-danger'>*</span></label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-13' />
                                </span>
                                <Field type="number" min={0} className="form-control" name='budget' autoComplete='off' />
                            </div>
                            <ErrorMessage name='budget' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-4 py-2'>
                            <label className='font-13'>Source <span className='text-danger'>*</span></label>
                            <Field as="select" className="form-control" name='source'>
                                <option value="0" label="Select source" />
                                {sourcesData?.map((item, index) => {
                                    return <option value={item.id} label={item.name} key={index} />
                                })}
                            </Field>
                            <ErrorMessage name='source' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-12 pt-2 text-end' style={{ borderTop: "1px solid #dee2e6" }}>
                            <button type='button' className="CancelBtn me-2" onClick={() => resetForm()}>
                                Reset
                            </button>
                            <button type='submit' className="SuccessBtn">
                                Confirm
                            </button>

                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <ReCAPTCHA ref={recaptcharef} sitekey={captchasitekey}
                                size="invisible" onChange={handleRecaptcha} />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
