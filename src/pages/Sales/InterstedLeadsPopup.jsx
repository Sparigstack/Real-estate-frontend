import React, { useEffect, useState } from 'react'
import DropdownTreeSelectBox from '../../components/suggestionbox/DropdownTreeSelectBox'
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';
import Loader from '../../components/loader/Loader';
import AlertComp from '../../components/alerts/AlertComp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import LeadForm from '../../components/LeadForm';
import Images from '../../utils/Images';

export default function InterstedLeadsPopup({ setInterstedLeadPopup, unitId, setShowAlerts }) {
    const [allLeads, setAllLeads] = useState([]);
    const [leadvalues, setLeadvalues] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [Errormsg, setErrormsg] = useState('');
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const { schemeId, refreshPropertyDetails } = useProperty();
    const [showForm, setShowForm] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [initialValues, setinitialValues] = useState({
        name: '',
        email: '',
        source: 0,
        contactno: '',
        budget: '',
        notes: '',
        agent_name: '',
        agent_contact: '',
        status: ''
    })
    useEffect(() => {
        getUnitLeads();
        setAllLeads([]);
        setLeadvalues([]);
        getAllLeads();
    }, [])
    const getAllLeads = async () => {
        try {
            setLoading(true);
            const result = await getAPIAuthKey(`/get-lead-name-with-detail/${schemeId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            const transformedLeads = responseRs.map(lead => ({
                label: `${lead.name} (${lead.contact_no})`,
                name: lead.name,
                value: lead.id,
                contactno: lead.contact_no
            }));
            setAllLeads(transformedLeads);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const getUnitLeads = async () => {
        try {
            setLoading(true);
            const result = await getAPIAuthKey(`/get-unit-interested-leads/${unitId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.length > 0) {
                const existingLeadValues = responseRs.map(lead => ({
                    label: `${lead.name} (${lead.contact_no})`,
                    name: lead.name,
                    value: lead.id,
                    contactno: lead.contact_no,
                    budget: lead.budget
                }));
                setLeadvalues(existingLeadValues);
                setShowButtons(true)
            }
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleCategoryChange = (selectedLeads) => {
        const updatedLeadValues = [...leadvalues, ...selectedLeads].reduce((acc, lead) => {
            if (!acc.find(item => item.value === lead.value)) {
                acc.push(lead);
            }
            return acc;
        }, []);
        setErrormsg('');
        setShowButtons(true)
        setLeadvalues(updatedLeadValues);
    };

    const hidePopup = () => {
        setInterstedLeadPopup(false);
    }
    const handleBudgetChange = (index, newBudget) => {
        const updatedLeadValues = [...leadvalues];
        updatedLeadValues[index].budget = newBudget;
        setLeadvalues(updatedLeadValues);
    };

    const SaveInterstedLeads = async () => {
        if (leadvalues.length == 0) {
            setErrormsg("Select at least one lead");
            return false;
        }
        setLoading(true)
        var leadArray = [];
        {
            leadvalues.map((item) => {
                var vjson = {};
                vjson['lead_id'] = item.value;
                vjson['budget'] = item.budget || 0;
                leadArray.push(vjson);
            })
        }
        var raw = JSON.stringify({
            unit_id: unitId,
            property_id: schemeId,
            leads_array: leadArray
        })
        try {
            const result = await postAPIAuthKey('/add-interested-leads', raw);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == 'success') {
                setShowAlerts(<AlertComp show={true} variant="success" message={'Leads Added Successfully.'} />);
                setInterstedLeadPopup(false);
                refreshPropertyDetails();
                setTimeout(() => {
                    setLoading(false);
                    setShowAlerts(false);
                }, 2000);
            }
            else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => {
                    setLoading(false);
                    setShowAlerts(false);
                }, 2000);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const handleAddLead = async (values) => {
        setLoading(true);
        try {
            const raw = JSON.stringify({ ...values, propertyinterest: schemeId, leadid: 0, unitId: unitId, flag: 1 });
            const result = await postAPIAuthKey('/add-edit-leads', raw);

            if (!result) {
                throw new Error('Something went wrong');
            }

            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == 'success') {
                setInterstedLeadPopup(false);
                setShowAlerts(<AlertComp show={true} variant="success" message={'Lead Added Successfully'} />);
                refreshPropertyDetails();
                setTimeout(() => {
                    setShowAlerts(false);
                }, 2000);
            }
            else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    return (
        <div>
            {Loading && <Loader runningcheck={Loading} />}

            {showForm ?
                <LeadForm formData={initialValues} setFormData={setinitialValues} handleAddLead={handleAddLead} handleHide={(e) => setInterstedLeadPopup(false)} showBudget={true} />
                :
                <>
                    <DropdownTreeSelectBox
                        data={allLeads}
                        mode={"multiSelect"}
                        onChange={handleCategoryChange}
                        selectedValue={leadvalues}
                        placeholder={"Choose Intersted Lead"} />
                    <div className='text-center'>
                        <div className='py-3'>OR</div>
                        <button type="btn" className='SuccessBtn' onClick={(e) => {
                            setShowForm(true);
                            setinitialValues({
                                ...initialValues,
                                name: '',
                                email: '',
                                source: 0,
                                budget: '',
                                contactno: ''
                            })
                        }}>
                            <img src={Images.addicon} className='bigiconsize h-100 pe-2' />
                            Add Lead</button>
                    </div>
                    <label className='text-danger font-13'>{Errormsg}</label>

                    {leadvalues.length > 0 && (
                        <div className='formLabel  py-2 text-start'>
                            <div className='row fw-semibold font-14 pb-1'>
                                <div className='col-md-4'>Contact Name</div>
                                <div className='col-md-4'>Contact No.</div>
                                <div className='col-md-4'>Budget</div>
                            </div>
                            <div className=''>
                                {leadvalues.map((item, index) => {
                                    return <div className='row align-items-center my-2 fw-medium formLabel  font-14 matchingleadsboxes'>
                                        <div className='col-md-4'>
                                            {item.name}
                                        </div>
                                        <div className='col-md-4'>
                                            {item.contactno}
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="input-group">
                                                <input type="number" min={0} className="form-control font-13" name='budget'
                                                    autoComplete='off' value={item.budget} onChange={(e) => handleBudgetChange(index, e.target.value)} />
                                                <span className="input-group-text inputbg">
                                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-13' />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                })}
                            </div>
                        </div>
                    )}
                    {showButtons && (
                        <div className='col-12 pt-2 text-center'>
                            <button type="button" className='CancelBtn me-2' onClick={(e) => hidePopup()}>Cancel</button>
                            <button type="submit" className='SuccessBtn' onClick={SaveInterstedLeads}>Save</button>
                        </div>
                    )}
                </>
            }


        </div >
    )
}
