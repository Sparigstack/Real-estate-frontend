import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AddUpdateLeadValidationSchema from '../../utils/validations/AddUpdateLeadValidationSchema';
import useApiService from '../../hooks/useApiService';
import Loader from '../../components/loader/Loader';
import GeneralFields from './LeadForm/GeneralFields';
import OptionalFields from './LeadForm/OptionalFields';
import LeadTags from './LeadForm/LeadTags';
import useProperty from '../../hooks/useProperty';
import AlertComp from '../../components/alerts/AlertComp';

export default function AddUpdateLeadForm() {
    const { postAPIAuthKey, getAPIAuthKey } = useApiService();
    const navigate = useNavigate();
    const { schemeId } = useProperty();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const location = useLocation();
    const unitidfromsales = location.state && location.state.unitid;
    const leadid = location.state && location.state.leadid;
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        contactno: '',
        email: null,
        source: 0,
        status: '',
        budget: '',
        address: '',
        state: '',
        city: '',
        pincode: '',
        reminder_date: '',
        notes: '',
        agent_name: '',
        agent_contact: ''
    });
    useEffect(() => {
        const getLeadById = async () => {
            if (!leadid) return;
            setLoading(true);
            try {
                const result = await getAPIAuthKey(`/fetch-lead-detail/${schemeId}/${leadid}`);
                if (!result) {
                    throw new Error('Something went wrong');
                }
                const responseRs = JSON.parse(result);
                setLoading(false);
                setFormData({
                    name: responseRs.name || '',
                    source: responseRs.source_id || 0,
                    status: responseRs.status_id || '',
                    contactno: responseRs.contact_no || '',
                    email: responseRs.email || null,
                    agent_name: responseRs.agent_name || '',
                    agent_contact: responseRs.agent_contact || '',
                    budget: responseRs.budget || '',
                    address: responseRs.address || '',
                    state: responseRs.state || '',
                    city: responseRs.city || '',
                    pincode: responseRs.pincode || '',
                    reminder_date: responseRs.reminder_date || '',
                    notes: responseRs.notes || '',
                });
                setTags(responseRs.tags);
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        getLeadById();
        getLeadTags();
    }, [leadid])
    const getLeadTags = async () => {
        try {
            const result = await getAPIAuthKey(`/fetch-tags/${schemeId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setAllTags(responseRs)
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleAddLead = async (values) => {
        setLoading(true);
        try {
            const raw = JSON.stringify({
                ...values, propertyinterest: schemeId,
                leadid: leadid,
                unitId: unitidfromsales || null,
                tags: tags
            });
            const result = await postAPIAuthKey('/add-edit-leads', raw);

            if (!result) {
                throw new Error('Something went wrong');
            }

            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == 'success') {
                var msg = leadid == 0 ? 'Lead Added Successfully' : 'Lead Updated Successfully';
                setShowAlerts(<AlertComp show={true} variant="success" message={msg} />);
                setTimeout(() => {
                    setShowAlerts(false);
                    navigate('/all-leads')
                }, 2000);
            }
            else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => {
                    setShowAlerts(false);
                }, 5000);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    return (
        <div>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'>
                        <label className='graycolor cursor-pointer' onClick={(e) => navigate('/all-leads')}>
                            All Leads /</label> {leadid == 0 ? 'Add Lead' : 'Edit Lead'}
                    </div>
                </div>
            </div>
            <Formik initialValues={formData}
                validateOnBlur={false}
                validateOnChange={false}
                validationSchema={AddUpdateLeadValidationSchema}
                enableReinitialize={true}
                onSubmit={(values) => {
                    setFormData(values);
                    handleAddLead(values);
                }}>
                {({ values, setFieldValue }) => (
                    <Form className='p-4 property-form'>
                        <GeneralFields setFieldValue={setFieldValue} values={values} showBudget={unitidfromsales} />
                        <OptionalFields setFieldValue={setFieldValue} values={values} />
                        <LeadTags setTags={setTags} tags={tags} allTags={allTags} />
                        <div className='col-12 pt-5 text-center'>
                            <button type='button' className="cancelBtn me-2" onClick={(e) => navigate('/all-leads')}>
                                Cancel
                            </button>
                            <button type='submit' className="otpBtn">
                                Save
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
