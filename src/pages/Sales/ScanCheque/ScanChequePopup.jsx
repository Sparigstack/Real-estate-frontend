import React, { useState } from 'react'
import DropdownTreeSelectBox from '../../../components/suggestionbox/DropdownTreeSelectBox';
import UploadCheque from './UploadCheque';
import CustomerForm from './CustomerForm';
import MatchingLead from './MatchingLead';


export default function ScanChequePopup({ setScanChequeModal, setShowAlerts, setloading, WingDetails }) {
    const [leadData, setLeadData] = useState({
        MatchingData: [],
        AllLeads: [],
        amount: ''
    })
    const [scanDiv, setScanDiv] = useState(false);
    const [leadvalue, setLeadvalue] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [initialValues, setinitialValues] = useState({
        contact_name: '',
        contact_number: '',
        contact_email: '',
        lead_id: null,
        total_amount: '',
        wing: '',
        unit: ''
    })

    const handleCategoryChange = (selectedLeadId) => {
        const selectedLead = leadData.AllLeads.find(lead => lead.value == selectedLeadId[0].value);
        setLeadvalue(selectedLeadId);
        setinitialValues({
            ...initialValues,
            lead_id: selectedLead.value,
            contact_name: selectedLead.label,
            contact_number: selectedLead.contact_no,
            contact_email: selectedLead.email
        });
        setShowForm(true)
    };
    return (
        <div className='col-12 text-center'>
            <UploadCheque setloading={setloading} setShowAlerts={setShowAlerts} setShowForm={setShowForm}
                setLeadData={setLeadData} leadData={leadData} setScanDiv={setScanDiv} scanDiv={scanDiv} />

            {scanDiv && (
                leadData?.MatchingData?.length > 0 ?
                    <MatchingLead leadData={leadData} setScanChequeModal={setScanChequeModal} WingDetails={WingDetails}
                        setloading={setloading} setShowAlerts={setShowAlerts} />
                    :
                    !showForm ?
                        <div className='col-12 text-center'>
                            <div className='col-12 d-grid justify-content-center text-start'>
                                <DropdownTreeSelectBox data={leadData.AllLeads} mode={"radioSelect"} onChange={handleCategoryChange} selectedValue={leadvalue}
                                    placeholder={"Choose Lead Contact"} />
                            </div>
                            <div className='text-center'>
                                <div className='py-3'>OR</div>
                                <button type="btn" className='SuccessBtn' onClick={(e) => setShowForm(true)}>Add Customer</button>
                            </div>
                        </div>
                        :
                        <CustomerForm initialValues={initialValues} setinitialValues={setinitialValues} setScanChequeModal={setScanChequeModal}
                            leadvalue={leadvalue} WingDetails={WingDetails} leadData={leadData} />
            )}

        </div>
    )
}
