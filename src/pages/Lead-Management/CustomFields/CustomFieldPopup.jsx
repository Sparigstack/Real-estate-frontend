import React, { useEffect, useState } from 'react'
import useApiService from '../../../hooks/useApiService';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import SingleSelection from './SingleSelection';
import MultiSelection from './MultiSelection';
import { CustomFieldValidationSchema } from '../../../utils/validations/CustomFieldValidationSchema';

export default function CustomFieldPopup({ setLoading, setshowAlerts, handleHide }) {
    const [FieldTypes, setFieldTypes] = useState([]);
    const [singleSelectionOptions, setSingleSelectionOptions] = useState([]);
    const [multiSelectionOptions, setMultiSelectionOptions] = useState([]);
    const [requiredMsg, setrequiredMsg] = useState('');
    const { getAPIAuthKey } = useApiService();
    useEffect(() => {
        setFieldTypes([]);
        getAllFieldTypes();
    }, [])
    const getAllFieldTypes = async () => {
        try {
            setLoading(true);
            const result = await getAPIAuthKey(`/get-field-types`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setFieldTypes(responseRs);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleSubmit = (values) => {
        const submissionData = {
            ...values,
            singleselection: singleSelectionOptions || null,
            multiselection: multiSelectionOptions || null,
        };
        if (values.fieldtype == '5' && (singleSelectionOptions.length === 0 || !singleSelectionOptions[0])) {
            setrequiredMsg("One option is required for single selection.");
            return;
        }

        if (values.fieldtype == '6' && (multiSelectionOptions.length === 0 || !multiSelectionOptions[0])) {
            setrequiredMsg("One option is required for multi-selection.");
            return;
        }
        setrequiredMsg("");
        console.log(submissionData);
    }
    const handleFieldType = (id) => {
        setSingleSelectionOptions([])
        setMultiSelectionOptions([])
        if (id == 5) {
            setSingleSelectionOptions([...singleSelectionOptions, '']);
        } else if (id == 6) {
            setMultiSelectionOptions([...multiSelectionOptions, '']);
        }
    }
    return (
        <div className='px-0 pb-4 row font-13 formLabel'>
            <Formik initialValues={{
                fieldname: '',
                fieldtype: '',
                fieldrequired: '',
                singleselection: [],
                multiselection: [],
            }}
                validationSchema={CustomFieldValidationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={handleSubmit}>
                {({ handleReset, values, setFieldValue }) => (
                    <Form className='row '>
                        <div className='col-md-6 mt-3 mb-4 px-0 position-relative'>
                            <label className='input-labels'>Field Name <span className='text-danger'>*</span></label>
                            <Field type="text" className="custom-inputs" name='fieldname' autoComplete='off' />
                            <ErrorMessage name='fieldname' component="div" className="text-start errorText" />
                        </div>
                        <div className='mb-4 px-2 position-relative'>
                            <label className='mb-2 fw-semibold'>Field Type <span className='text-danger'>*</span></label>
                            <div className='row'>
                                {FieldTypes?.map((item, index) => (
                                    <div key={index} className="mb-2 col-md-4">
                                        <label className={`d-flex align-items-center pb-1`}>
                                            <Field className="me-2" type="radio" name="fieldtype"
                                                value={item.id.toString()} onChange={(e) => { handleFieldType(item.id); setFieldValue('fieldtype', item.id.toString()) }} />
                                            {item.type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <ErrorMessage name='fieldtype' component="leads" className="text-start errorText" />
                        </div>
                        <div className='mb-4 px-2'>
                            <div className='d-flex '>
                                <label className='fw-semibold'>Make this field mandatory? <span className='text-danger'>*</span></label>
                                <label className={`d-flex align-items-center ps-3 pb-1`}>
                                    <Field className="me-2" type="radio" name="fieldrequired" value={"1"} />
                                    Yes
                                </label>
                                <label className={`d-flex align-items-center ps-3 pb-1`}>
                                    <Field className="me-2" type="radio" name="fieldrequired" value={"2"} />
                                    No
                                </label>
                            </div>
                            <ErrorMessage name='fieldrequired' component="div" className="ps-2 text-start errorText" />
                        </div>
                        {values.fieldtype == '5' && (
                            <SingleSelection singleSelectionOptions={singleSelectionOptions} setrequiredMsg={setrequiredMsg}
                                setSingleSelectionOptions={setSingleSelectionOptions} requiredMsg={requiredMsg} />
                        )}
                        {values.fieldtype == '6' && (
                            <MultiSelection multiSelectionOptions={multiSelectionOptions} setrequiredMsg={setrequiredMsg}
                                setMultiSelectionOptions={setMultiSelectionOptions} requiredMsg={requiredMsg} />
                        )}
                        <div className='col-12 pt-3 text-center' >
                            <button type='button' className="CancelBtn me-2" onClick={handleReset}>
                                Reset
                            </button>
                            <button type='submit' className="SuccessBtn">
                                Confirm
                            </button>
                        </div>
                    </Form>
                )}

            </Formik>
        </div>
    )
}
