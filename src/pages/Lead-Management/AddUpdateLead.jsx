import { Field, Formik, Form, ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react'
import AddUpdateLeadValidationSchema from '../../utils/validations/AddUpdateLeadValidationSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import useApiService from '../../services/ApiService';
import Cookies from 'js-cookie';

export default function AddUpdateLead({ formData, setFormData, handleAddLead, handleHide }) {
    const { getAPI } = useApiService();
    const userId = Cookies.get('userId');
    const [sourcesData, setsourcesData] = useState([]);
    const [propertiesData, setpropertiesData] = useState([]);
    useEffect(() => {
        getSources();
        getProperties();
    }, []);
    async function getSources() {
        try {
            const result = await getAPI(`/get-sources`, 2);
            if (!result) {
                throw new Error('Something went wrong');
            }

            const responseRs = JSON.parse(result);
            setsourcesData(responseRs)
        }
        catch (error) {
            console.error(error);
        }
    }
    async function getProperties() {
        try {
            const result = await getAPI(`/get-user-properties/${userId}`, 2);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setpropertiesData(responseRs)
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <Formik initialValues={formData}
            validationSchema={AddUpdateLeadValidationSchema}
            onSubmit={(values) => {
                setFormData(values);
                handleAddLead(values);
            }}>
            {() => (
                <Form className='row'>
                    <div className='col-md-4 pb-2'>
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
                    <div className='col-md-4 py-2 pb-4'>
                        <label className='font-13'>Property Interest <span className='text-danger'>*</span></label>
                        <Field as="select" className="form-control" name='propertyinterest'>
                            <option value="0" label="Select Property" />
                            {propertiesData?.map((item, index) => {
                                return <option value={item.id} label={item.name} key={index} />
                            })}
                        </Field>
                        <ErrorMessage name='propertyinterest' component="div" className="text-start errorText" />
                    </div>
                    <div className='col-12 pt-2 text-end' style={{ borderTop: "1px solid #dee2e6" }}>
                        <button type='button' className="CancelBtn me-2" onClick={handleHide}>
                            Cancel
                        </button>
                        <button type='submit' className="SuccessBtn">
                            Confirm
                        </button>

                    </div>
                </Form>
            )}
        </Formik>
    )
}
