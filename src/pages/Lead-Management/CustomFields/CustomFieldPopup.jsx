import React, { useEffect, useState } from 'react'
import useApiService from '../../../hooks/useApiService';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import SingleSelection from './SingleSelection';
import MultiSelection from './MultiSelection';
import { CustomFieldValidationSchema } from '../../../utils/validations/CustomFieldValidationSchema';
import useProperty from '../../../hooks/useProperty';
import AlertComp from '../../../components/alerts/AlertComp';

export default function CustomFieldPopup({ setLoading, setshowAlerts, handleHide, fieldid, getAllFields }) {
    const { schemeId } = useProperty();
    const [FieldTypes, setFieldTypes] = useState([]);
    const [singleSelectionOptions, setSingleSelectionOptions] = useState([]);
    const [multiSelectionOptions, setMultiSelectionOptions] = useState([]);
    const [requiredMsg, setrequiredMsg] = useState('');
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const [allData, setAllData] = useState({
        fieldname: '',
        fieldtype: '',
        singleselection: [],
        multiselection: []
    })
    useEffect(() => {
        setFieldTypes([]);
        getAllFieldTypes();
    }, [])
    useEffect(() => {
        const getFieldValue = async () => {
            try {
                if (!fieldid) return;
                setLoading(true);
                const result = await getAPIAuthKey(`/fetch-custom-field/` + fieldid);
                if (!result) {
                    throw new Error('Something went wrong');
                }
                const responseRs = JSON.parse(result);
                setAllData({
                    ...allData,
                    fieldname: responseRs.name,
                    fieldtype: responseRs.custom_fields_type_values_id?.toString() || '',
                    singleselection: responseRs.custom_fields_type_values_id == 5 ? responseRs.custom_field_structures : [],
                    multiselection: responseRs.custom_fields_type_values_id == 6 ? responseRs.custom_field_structures : [],
                });
                if (responseRs.custom_fields_type_values_id == 5) {
                    setSingleSelectionOptions(responseRs.custom_field_structures)
                } else if (responseRs.custom_fields_type_values_id == 6) {
                    setMultiSelectionOptions(responseRs.custom_field_structures)
                }
                setLoading(false);
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        getFieldValue();
    }, [fieldid])
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
    const handleSubmit = async (values) => {
        setLoading(true);
        const submissionData = JSON.stringify({
            ...values,
            singleselection: singleSelectionOptions || null,
            multiselection: multiSelectionOptions || null,
            propertyId: schemeId,
            fieldId: fieldid
        });
        if (values.fieldtype == '5' && (singleSelectionOptions.length === 0 || !singleSelectionOptions[0])) {
            setrequiredMsg("One option is required for single selection.");
            return;
        }

        if (values.fieldtype == '6' && (multiSelectionOptions.length === 0 || !multiSelectionOptions[0])) {
            setrequiredMsg("One option is required for multi-selection.");
            return;
        }
        setrequiredMsg("");
        const result = await postAPIAuthKey('/add-custom-fields', submissionData);

        if (!result) {
            throw new Error('Something went wrong');
        }

        const responseRs = JSON.parse(result);
        setLoading(false);
        if (responseRs.status == 'success') {
            var msg = fieldid == 0 ? 'Field Added Successfully' : 'Field Updated Successfully';
            setshowAlerts(<AlertComp show={true} variant="success" message={msg} />);
            handleHide();
            getAllFields();
            setTimeout(() => {
                setshowAlerts(false);
            }, 2000);
        }
        else {
            setshowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
            setTimeout(() => {
                setshowAlerts(false);
            }, 5000);
        }
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
            <Formik initialValues={allData}
                enableReinitialize={true}
                validationSchema={CustomFieldValidationSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={handleSubmit}>
                {({ handleReset, values, setFieldValue }) => (
                    <Form className='row '>
                        <div className='col-12 mb-4 px-0 position-relative'>
                            <label className='input-labels'>Field Name <span className='text-danger'>*</span></label>
                            <Field type="text" className="custom-inputs" name='fieldname' autoComplete='off' />
                            <ErrorMessage name='fieldname' component="div" className="text-start errorText" />
                        </div>
                        <div className='col-md-12 px-0 mb-4 position-relative' style={{ backgroundColor: "white" }}>
                            <label className='input-labels'>Field Type <span className='text-danger'>*</span></label>
                            <div className='pt-4 custom-inputs'>
                                <div className='row'>
                                    {FieldTypes?.map((item, index) => (
                                        <div key={index} className="mb-2  col-md-6">
                                            <label className={`font-12 d-flex align-items-center pb-1`}>
                                                <Field className="me-2" type="radio" name="fieldtype"
                                                    disabled={fieldid != 0}
                                                    value={item.id.toString()}
                                                    checked={values.fieldtype == item.id.toString()}
                                                    onChange={(e) => { handleFieldType(item.id); setFieldValue('fieldtype', item.id.toString()) }} />
                                                {item.type}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {values.fieldtype == '5' && (
                                    <SingleSelection singleSelectionOptions={singleSelectionOptions} setrequiredMsg={setrequiredMsg}
                                        setSingleSelectionOptions={setSingleSelectionOptions} requiredMsg={requiredMsg} />
                                )}
                                {values.fieldtype == '6' && (
                                    <MultiSelection multiSelectionOptions={multiSelectionOptions} setrequiredMsg={setrequiredMsg}
                                        setMultiSelectionOptions={setMultiSelectionOptions} requiredMsg={requiredMsg} />
                                )}
                            </div>
                            <ErrorMessage name='fieldtype' component="leads" className="text-start errorText" />

                        </div>

                        <div className='col-12 pt-3 text-center' >
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
        </div>
    )
}
