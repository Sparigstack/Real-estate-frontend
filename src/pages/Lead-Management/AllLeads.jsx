import { faArrowUpAZ, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useState } from 'react'
import Images from '../../utils/Images'
import CustomModal from '../../utils/CustomModal'
import AlertComp from '../../components/alerts/AlertComp'
import CustomPagination from '../../components/pagination/CustomPagination'
import { debounce } from 'lodash';
import useApiService from '../../hooks/useApiService'
import useProperty from '../../hooks/useProperty'
import Loader from '../../components/loader/Loader'
import { useNavigate } from 'react-router-dom'
import LeadForm from '../../components/LeadForm'
import { formatCurrency } from '../../utils/js/Common'

export default function AllLeads() {
    const { postAPIAuthKey, getAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [LeadPopup, setLeadPopup] = useState(false);
    const [LeadData, setLeadData] = useState([]);
    const [AddUpdateFlag, setAddUpdateFlag] = useState(1);
    const [InfoPopup, setInfoPopup] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: null,
        source: 0,
        contactno: '',
        leadid: 0,
        notes: '',
        agent_name: '',
        agent_contact: '',
        status: ''
    });
    const [utils, setUtils] = useState({
        search: null,
        sortbykey: 'desc',
        sortbyvalue: null,
    })
    const [activeTab, setActiveTab] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [LeadInfoData, setLeadInfoData] = useState('');
    const [totalItems, setTotalItems] = useState('');
    var itemsPerPage = 5;
    const navigate = useNavigate();

    const debouncedSearch = useCallback(debounce((searchValue) => {
        getAllLeads(searchValue, utils.sortbyvalue);
    }, 500), [utils.sortbyvalue, currentPage]);

    useEffect(() => {
        getAllLeads(utils.search, utils.sortbyvalue);
    }, [currentPage]);

    useEffect(() => {
        getAllLeads(null, null);
        setUtils({ ...utils, search: '', sortbykey: 'desc', sortbyvalue: null })
    }, [activeTab]);

    const getAllLeads = async (search = '', sortbyvalue = null) => {
        try {
            const sortby = utils.sortbykey == 'asc' ? 'desc' : 'asc';
            var searchstring = search == '' ? null : search;
            setLoading(true);
            const result = await getAPIAuthKey(`/get-leads/${schemeId}&${activeTab}&${searchstring}&${sortby}&${sortbyvalue}&${currentPage}&${itemsPerPage}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLeadData(responseRs.data);
            setTotalItems(responseRs.total);
            setUtils((prev) => ({ ...prev, sortbykey: sortby }));
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleHide = () => setLeadPopup(false);

    const handleAddLead = async (values) => {
        setLoading(true);
        try {
            const raw = JSON.stringify({ ...values, propertyinterest: schemeId, leadid: formData.leadid, flag: 1, unitId: null });
            const result = await postAPIAuthKey('/add-edit-leads', raw);

            if (!result) {
                throw new Error('Something went wrong');
            }

            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == 'success') {
                setLeadPopup(false);
                var msg = AddUpdateFlag == 1 ? 'Lead Added Successfully' : 'Lead Updated Successfully';
                setShowAlerts(<AlertComp show={true} variant="success" message={msg} />);
                setTimeout(() => {
                    setShowAlerts(false);
                    getAllLeads(utils.search, utils.sortbyvalue);
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

    const getLeadById = async (leadid) => {
        if (!leadid) return;
        setLoading(true);
        try {
            const result = await getAPIAuthKey(`/fetch-lead-detail/${schemeId}/${leadid}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLeadPopup(true);
            setLoading(false);
            setFormData({
                ...formData, ...responseRs, contactno: responseRs.contact_no, source: responseRs.source_id, leadid: responseRs.id,
                status: responseRs.status_id
            });
            setAddUpdateFlag(2)
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const getLeadInfoById = async (leadid) => {
        if (!leadid) return;
        setLoading(true);
        try {
            const result = await getAPIAuthKey(`/fetch-lead-intersted-booked-detail/${schemeId}/${leadid}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setInfoPopup(true)
            setLoading(false);
            setLeadInfoData(responseRs?.leadcustomerdetails);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const handlePageChange = (page) => setCurrentPage(page);

    const infodetails = (
        <div className='px-0 pb-4 row font-13 formLabel'>
            <div className='col-md-12 mb-3'>
                <div className='fw-bold font-14'>Lead Details</div>
                <div className='white_boxes mt-2 '>
                    <div className='row'>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Name</label>
                            <label>: &nbsp; {LeadInfoData?.name}</label>
                        </div>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Contact No.</label>
                            <label>: &nbsp; {LeadInfoData?.contact_no}</label>
                        </div>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Source</label>
                            <label>: {LeadInfoData?.source_name}</label>
                        </div>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Status</label>
                            <label>: {LeadInfoData?.status_name}</label>
                        </div>
                        {LeadInfoData?.source_name == "Agent" && (
                            <>
                                <div className='col-md-6 pb-2'>
                                    <label className='fw-semibold'>Agent Name</label>
                                    <label>: {LeadInfoData?.agent_name || '-'}</label>
                                </div>
                                <div className='col-md-6 pb-2'>
                                    <label className='fw-semibold'>Agent Contact </label>
                                    <label>: {LeadInfoData?.agent_contact || '-'}</label>
                                </div>
                            </>
                        )}
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Email</label>
                            <label>: &nbsp; {LeadInfoData?.email || '-'}</label>
                        </div>
                        <div className='col-md-12'>
                            <label className='fw-semibold'>Notes</label>
                            <label>: &nbsp; {LeadInfoData?.notes || '-'}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <div className='fw-bold font-14'>Intersted Units</div>
                <div className='white_boxes mt-2 '>
                    {LeadInfoData?.interested_units?.length ?
                        LeadInfoData?.interested_units?.map((item, index) => {
                            return <div className='row' key={index}>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Unit</label>
                                    <label>: &nbsp; {item.wing_name}{item.wing_name && '-'}{item.unit_name}</label>
                                </div>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Budget</label>
                                    <label>: &nbsp; {item.budget ? formatCurrency(item.budget) : 0} <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1 font-13' /></label>
                                </div>
                            </div>
                        })
                        :
                        <div className='col-12 text-center'>
                            No Data Found
                        </div>
                    }
                </div>
            </div>
            <div className='col-md-6'>
                <div className='fw-bold font-14'>Booked Units</div>
                <div className='white_boxes mt-2 '>
                    {LeadInfoData?.booked_units?.length ?
                        LeadInfoData?.booked_units?.map((item, index) => {
                            return <div className='row' key={index}>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Unit</label>
                                    <label>: &nbsp; {item.wing_name} - {item.unit_name}</label>
                                </div>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Total Paid</label>
                                    <label>: &nbsp; {item.total_paid_amount} <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1 font-13' /></label>
                                </div>
                            </div>
                        })
                        :
                        <div className='col-12 text-center'>
                            No Data Found
                        </div>
                    }
                </div>
            </div>
        </div >
    );
    return (
        <div>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'> All Leads</div>
                    <div className='col-6 font-13 d-flex justify-content-end'>
                        <div className='fontwhite cursor-pointer px-2 d-flex align-items-center' onClick={(e) => {
                            setLeadPopup(true); setFormData({ ...formData, name: '', source: 0, contactno: '', leadid: 0, notes: '' });
                            setAddUpdateFlag(1)
                        }}>
                            <img src={Images.addicon} className='bigiconsize pe-2' />
                            Add Lead
                        </div>
                        <div className='fontwhite cursor-pointer px-2 d-flex align-items-center' onClick={(e) => navigate('/upload-csv')}>
                            <img src={Images.upload} className='iconsize pe-2' />
                            Upload CSV
                        </div>
                        <div className='fontwhite cursor-pointer px-2 d-flex align-items-center' onClick={(e) => navigate('/lead-setting')}>
                            <img src={Images.leadSetting} className='bigiconsize pe-2' />
                            Lead Setting
                        </div>
                    </div>
                </div>
            </div>
            <div className='row py-2 align-items-center'>
                <div className='col-md-4'>
                    <div className='tab_bg'>
                        <div className='row align-items-center px-2'>
                            <div className={`col-5 ${activeTab == 2 && "active_tab"}  cursor-pointer`}
                                onClick={(e) => { setActiveTab(2) }}>Members</div>
                            <div className={`col-5 ${activeTab == 3 && "active_tab"}  cursor-pointer`}
                                onClick={(e) => { setActiveTab(3); }}>Non-Members</div>
                            <div className='col-2 ps-0'>
                                {activeTab != 1 && (
                                    <img src={Images.white_cancel} className='cursor-pointer'
                                        onClick={(e) => { setActiveTab(1); setUtils({ ...utils, search: '', sortbykey: 'desc', sortbyvalue: null }) }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 offset-md-4'>
                    <div className="position-relative">
                        <img src={Images.searchIcon} alt="search-icon" className="search-icon" />
                        <input
                            type="text"
                            className="form-control searchInput"
                            placeholder="Search"
                            value={utils.search}
                            onChange={(e) => {
                                debouncedSearch(e.target.value);
                                setUtils({ ...utils, search: e.target.value })
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='col-12 py-1'>
                <label className='blue_text '>
                    <label className='blue_dot'></label>
                    <label className='ps-1'>New</label>
                </label>
                <label className='green_text ps-3'>
                    <label className='green_dot'></label>
                    <label className='ps-1'>Hot</label>
                </label>
                <label className='yellow_text ps-3'>
                    <label className='yellow_dot'></label>
                    <label className='ps-1'>Cold</label>
                </label>
                <label className='red_text ps-3'>
                    <label className='red_dot'></label>
                    <label className='ps-1'>Dead</label>
                </label>
                <label className='navyblue_text ps-3'>
                    <label className='navyblue_dot'></label>
                    <label className='ps-1'>Lead to Customer</label>
                </label>
            </div>
            <div className='GridHeader'>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-md-3 cursor-pointer' title='Sort by Name' onClick={(e) => { getAllLeads(utils.search, 'name'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'name' })) }}>
                        Name<FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2 cursor-pointer ' title='Sort by Contact Number' onClick={(e) => { getAllLeads(utils.search, 'contact_no'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'property' })) }}>
                        Contact <FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2  cursor-pointer' title='Sort by Source' onClick={(e) => { getAllLeads(utils.search, 'source'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'source' })) }}>
                        Source<FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2 cursor-pointer ' title='Sort by Email' onClick={(e) => { getAllLeads(utils.search, 'email'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'email' })) }}>
                        Email<FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2 text-center'>Action</div>
                </div>
            </div>
            <div className="parent-container">
                <div className=''>
                    {LeadData.length ? LeadData.map((item, index) => {
                        var statuscolor = "";
                        if (item.status_id == 1) {
                            statuscolor = "blue_dot";
                        } else if (item.status_id == 2) {
                            statuscolor = "navyblue_dot";
                        } else if (item.status_id == 3) {
                            statuscolor = "green_dot";
                        } else if (item.status_id == 4) {
                            statuscolor = "yellow_dot";
                        } else if (item.status_id == 5) {
                            statuscolor = "red_dot";
                        }
                        return <div className='row GridData' key={index}>
                            <div className='col-md-1'>
                                <label className={statuscolor}></label>
                            </div>
                            <div className='col-md-3 ps-3 d-flex align-items-center'>
                                {item.entity_type == 2 && (
                                    <img src={Images.profile_icon_white} className='pe-2 iconsize' />
                                )}
                                <label>{item.name}</label>
                            </div>
                            <div className='col-md-2'>{item.contact_no}</div>
                            <div className='col-md-2 '>{item?.lead_source ? item?.lead_source?.name : '-'}</div>
                            <div className='col-md-2'>{item.email || '-'}</div>
                            <div className='col-md-2 text-center'>
                                <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Lead'
                                    onClick={(e) => getLeadById(item.id)} />
                                <img src={Images.white_info} className='cursor-pointer iconsize me-2' title='Show Information'
                                    onClick={(e) => getLeadInfoById(item.id)} />
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
                {LeadData.length && (
                    <CustomPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} handlePageChange={handlePageChange} />
                )}
            </div>
            <CustomModal isShow={LeadPopup} size={"md"} title={AddUpdateFlag == 1 ? "Add Lead" : "Edit Lead"}
                bodyContent={<LeadForm formData={formData} setFormData={setFormData} handleAddLead={handleAddLead} handleHide={handleHide} />} closePopup={handleHide} showBudget={false} />

            <CustomModal isShow={InfoPopup} size={"lg"} title={"Lead Information"}
                bodyContent={infodetails} closePopup={(e) => setInfoPopup(false)} showBudget={false} />
        </div >
    )
}
