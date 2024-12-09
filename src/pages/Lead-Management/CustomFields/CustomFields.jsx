import React, { useEffect, useState } from 'react'
import Loader from '../../../components/loader/Loader';
import Images from '../../../utils/Images';
import CustomModal from '../../../utils/CustomModal';
import CustomFieldPopup from './CustomFieldPopup';
import useApiService from '../../../hooks/useApiService';
import useProperty from '../../../hooks/useProperty';
import { DDMMYYYY } from '../../../utils/js/Common';
import DeleteModal from '../../../utils/DeleteModal';
import AlertComp from '../../../components/alerts/AlertComp';

export default function CustomFields() {
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [LeadData, setLeadData] = useState([]);
    const [CustomFieldModal, setCustomFieldModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [deleteid, setDeleteid] = useState('');
    const [fieldid, setFieldid] = useState('')
    const { schemeId } = useProperty();
    const ExistingFields = [
        { name: 'Name', type: 'Small Text' },
        { name: 'Contact No', type: 'Small Text' },
        { name: 'Source', type: 'Single Selection' },
        { name: 'Status', type: 'Single Selection' },
        { name: 'Email', type: 'Small Text' },
        { name: 'Notes', type: 'Long Text' },
    ];
    useEffect(() => {
        getAllFields();
    }, [])
    const getAllFields = async () => {
        try {
            setLoading(true);
            const result = await getAPIAuthKey(`/get-custom-fields/` + schemeId);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLeadData(responseRs);
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const deletefield = async () => {
        const raw = JSON.stringify({
            propertyId: schemeId,
            fieldId: deleteid
        });
        const result = await postAPIAuthKey('/remove-custom-field', raw);

        if (!result) {
            throw new Error('Something went wrong');
        }

        const responseRs = JSON.parse(result);
        setLoading(false);
        if (responseRs.status == 'success') {
            setShowAlerts(<AlertComp show={true} variant="success" message={"Field Deleted Successfully."} />);
            setIsDeleteModal(false)
            getAllFields();
            setTimeout(() => {
                setShowAlerts(false);
            }, 2000);
        }
        else {
            setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
            setTimeout(() => {
                setShowAlerts(false);
            }, 5000);
        }
    }
    return (
        <div>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'>
                        Custom Fields for Leads
                    </div>
                    <div className='col-6 font-14'>
                        <div className='fontwhite cursor-pointer px-2 justify-content-end d-flex align-items-center'
                            onClick={(e) => { setCustomFieldModal(true); setFieldid(0) }}>
                            <img src={Images.addicon} className='bigiconsize pe-2' />
                            Add Field
                        </div>
                    </div>
                </div>
            </div>
            <div className='GridHeader mt-3'>
                <div className='row'>
                    <div className='col-md-3 ps-3'>
                        Name
                    </div>
                    <div className='col-md-3'>
                        Type
                    </div>
                    <div className='col-md-3'>
                        Created At
                    </div>
                    <div className='col-md-3 text-center'>Action</div>
                </div>
            </div>
            <div className="parent-container">
                <div className=''>
                    {LeadData.length &&
                        LeadData.map((item, index) => {
                            return <div className='row GridData' key={index}>
                                <div className='col-md-3 ps-3'>
                                    <label>{item.name}</label>
                                </div>
                                <div className='col-md-3'>{item?.value_type_name}</div>
                                <div className='col-md-3'>{DDMMYYYY(item.created_at)}</div>
                                <div className='col-md-3 text-center'>
                                    <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Field'
                                        onClick={(e) => { setFieldid(item.id); setCustomFieldModal(true) }} />
                                    <img src={Images.white_delete} className='cursor-pointer iconsize me-2' title='Delete Field'
                                        onClick={(e) => { setIsDeleteModal(true); setDeleteid(item.id) }} />
                                </div>
                            </div>
                        })
                    }
                    <>
                        {ExistingFields.map((item, index) => {
                            return <div className='row GridData' key={index}>
                                <div className='col-md-3 ps-3'>
                                    <label>{item.name}</label>
                                </div>
                                <div className='col-md-3'>{item.type}</div>
                                <div className='col-md-3'>-</div>
                                <div className='col-md-3 text-center'>-</div>
                            </div>
                        })}
                    </>
                </div>
            </div>

            <CustomModal isShow={CustomFieldModal} size={"lg"} title={fieldid == 0 ? "Add Field" : "Edit Lead"}
                bodyContent={<CustomFieldPopup setLoading={setLoading} getAllFields={getAllFields} fieldid={fieldid} setshowAlerts={setShowAlerts} handleHide={(e) => setCustomFieldModal(false)} />} closePopup={(e) => setCustomFieldModal(false)} showBudget={false} />

            <DeleteModal isShow={isDeleteModal} title={"Are you sure want to delete this Field?"} Cancel={(e) => setIsDeleteModal(false)}
                canceltext={"Cancel"} handleSuccess={deletefield} successtext={"Confirm"} />
        </div>
    )
}
