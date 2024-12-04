import React, { useState } from 'react'
import Loader from '../../../components/loader/Loader';
import Images from '../../../utils/Images';
import CustomModal from '../../../utils/CustomModal';
import CustomFieldPopup from './CustomFieldPopup';
import ExistingFields from './ExistingFields';

export default function CustomFields() {
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [LeadData, setLeadData] = useState([]);
    const [CustomFieldModal, setCustomFieldModal] = useState(false);
    const [activeTab, setActiveTab] = useState(1)
    return (
        <div>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'>
                        Custom Fields
                    </div>
                    <div className='col-6 font-14'>
                        <div className='fontwhite cursor-pointer px-2 justify-content-end d-flex align-items-center'
                            onClick={(e) => setCustomFieldModal(true)}>
                            <img src={Images.addicon} className='bigiconsize pe-2' />
                            Add Field
                        </div>
                    </div>
                </div>
            </div>
            <div className='row pt-3'>
                <div className='col-md-4'>
                    <div className='tab_bg'>
                        <div className='row align-items-center px-2'>
                            <div className={`col-6 ${activeTab == 1 && "active_tab"}  cursor-pointer`}
                                onClick={(e) => { setActiveTab(1) }}>Custom Fields</div>
                            <div className={`col-6 ${activeTab == 2 && "active_tab"}  cursor-pointer`}
                                onClick={(e) => { setActiveTab(2); }}>Existing Fields</div>
                        </div>
                    </div>
                </div>
            </div>
            {activeTab == 1 ?
                <>
                    <div className='GridHeader mt-3'>
                        <div className='row'>
                            <div className='col-md-3'>
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
                            {LeadData.length ?
                                LeadData.map((item, index) => {
                                    return <div className='row GridData' key={index}>
                                        <div className='col-md-3'>
                                            <label>Address</label>
                                        </div>
                                        <div className='col-md-3'>textarea</div>
                                        <div className='col-md-3'>02-12-2024</div>
                                        <div className='col-md-3 text-center'>
                                            <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Field' />
                                            <img src={Images.white_delete} className='cursor-pointer iconsize me-2' title='Delete Field' />
                                        </div>
                                    </div>
                                })
                                :
                                <div className='row text-center'>
                                    <label className='norecorddiv'>
                                        No Data Found</label>
                                </div>
                            }
                        </div>
                    </div>
                </>
                :
                <ExistingFields />
            }

            <CustomModal isShow={CustomFieldModal} size={"lg"} title={"Add Field"}
                bodyContent={<CustomFieldPopup setLoading={setLoading} setshowAlerts={setShowAlerts} handleHide={(e) => setCustomFieldModal(false)} />} closePopup={(e) => setCustomFieldModal(false)} showBudget={false} />
        </div>
    )
}
