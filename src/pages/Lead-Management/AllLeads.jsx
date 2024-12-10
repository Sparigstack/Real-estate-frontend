import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useState } from 'react'
import Images from '../../utils/Images'
import CustomModal from '../../utils/CustomModal'
import CustomPagination from '../../components/pagination/CustomPagination'
import { debounce } from 'lodash';
import useApiService from '../../hooks/useApiService'
import useProperty from '../../hooks/useProperty'
import Loader from '../../components/loader/Loader'
import { useNavigate } from 'react-router-dom'
import LeadInformationPopup from './LeadInformationPopup'

export default function AllLeads() {
    const { getAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [LeadData, setLeadData] = useState([]);
    const [InfoPopup, setInfoPopup] = useState(false);
    const [utils, setUtils] = useState({
        search: null,
        sortbykey: 'desc',
        sortbyvalue: null,
        statusid: null
    })
    const [activeTab, setActiveTab] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [LeadInfoData, setLeadInfoData] = useState('');
    const [totalItems, setTotalItems] = useState('');
    var itemsPerPage = 8;

    const debouncedSearch = useCallback(debounce((searchValue) => {
        getAllLeads(searchValue, utils.sortbyvalue, utils.statusid, utils.sortbykey, currentPage);
    }, 500), []);

    useEffect(() => {
        getAllLeads(null, null, null, null, 1);
        setUtils({ ...utils, search: '', sortbykey: 'desc', sortbyvalue: null, statusid: null })
    }, [activeTab]);

    const getAllLeads = async (search = '', sortbyvalue = null, statusid = null, sortDirection = 'asc', currentPage) => {
        try {
            var searchstring = search == '' ? null : search;
            setLoading(true);
            const result = await getAPIAuthKey(`/get-leads/${schemeId}&${activeTab}&${searchstring}&${sortDirection}&${sortbyvalue}&${statusid}&${currentPage}&${itemsPerPage}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLeadData(responseRs.data);
            setTotalItems(responseRs.total);
            setLoading(false);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        getAllLeads(utils.search, utils.sortbyvalue, utils.statusid, utils.sortbykey, page);  // Preserve sorting state
    };

    const handleSorting = (sortField) => {
        const newSortDirection = utils.sortbykey == 'asc' ? 'desc' : 'asc';
        setUtils((prev) => ({ ...prev, sortbyvalue: sortField, sortbykey: newSortDirection }));
        getAllLeads(utils.search, sortField, utils.statusid, newSortDirection, currentPage); // Pass updated sort direction and value
    };
    return (
        <div>
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-4'> All Leads</div>
                    <div className='col-8 font-13 d-flex justify-content-end'>
                        {[
                            { path: '/add-update-leads', icon: Images.addicon, label: 'Add Lead' },
                            { path: '/upload-csv', icon: Images.upload, label: 'Upload CSV' },
                            { path: '/lead-setting', icon: Images.leadSetting, label: 'Lead Setting' },
                        ].map(({ path, icon, label }, idx) => (
                            <div key={idx} className='px-2 d-flex align-items-center cursor-pointer' onClick={() => navigate(path, { state: { leadid: 0 } })}>
                                <img src={icon} className='bigiconsize pe-2' alt={label} />
                                {label}
                            </div>
                        ))}
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
                                        onClick={(e) => { setActiveTab(1); setUtils({ ...utils, search: '', sortbykey: 'desc', sortbyvalue: null, statusid: null }) }} />
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
            <div className='col-12 text-end py-1 d-flex justify-content-end align-items-center'>
                {utils.statusid && (
                    <div className='fontwhite pe-5'>
                        <b className='cursor-pointer text-decoration-underline'
                            onClick={(e) => { getAllLeads(utils.search, utils.sortbyvalue, null, utils.sortbykey, currentPage); setUtils((prevdata) => ({ ...prevdata, statusid: null })) }}>
                            Clear</b>
                    </div>
                )}
                <div className='blue_text'>
                    <label className='blue_dot'></label>
                    <label className='ps-1  cursor-pointer text-decoration-underline'
                        onClick={(e) => { getAllLeads(utils.search, utils.sortbyvalue, 1, utils.sortbykey, currentPage); setUtils((prevdata) => ({ ...prevdata, statusid: 1 })) }}>
                        New
                    </label>
                </div>
                <div className='navyblue_text ps-3'>
                    <label className='navyblue_dot'></label>
                    <label className='ps-1  cursor-pointer text-decoration-underline'
                        onClick={(e) => { getAllLeads(utils.search, utils.sortbyvalue, 2, utils.sortbykey, currentPage); setUtils((prevdata) => ({ ...prevdata, statusid: 2 })) }}>
                        Lead to Customer
                    </label>
                </div>
                <div className='green_text ps-3'>
                    <label className='green_dot'></label>
                    <label className='ps-1  cursor-pointer text-decoration-underline'
                        onClick={(e) => { getAllLeads(utils.search, utils.sortbyvalue, 3, utils.sortbykey, currentPage); setUtils((prevdata) => ({ ...prevdata, statusid: 3 })) }}>
                        Hot
                    </label>
                </div>
                <div className='yellow_text ps-3'>
                    <label className='yellow_dot'></label>
                    <label className='ps-1  cursor-pointer text-decoration-underline'
                        onClick={(e) => { getAllLeads(utils.search, utils.sortbyvalue, 4, utils.sortbykey, currentPage); setUtils((prevdata) => ({ ...prevdata, statusid: 4 })) }}>
                        Cold
                    </label>
                </div>
                <div className='red_text ps-3'>
                    <label className='red_dot'></label>
                    <label className='ps-1  cursor-pointer text-decoration-underline'
                        onClick={(e) => { getAllLeads(utils.search, utils.sortbyvalue, 5, utils.sortbykey, currentPage); setUtils((prevdata) => ({ ...prevdata, statusid: 5 })) }}>
                        Dead
                    </label>
                </div>
            </div>
            <div className='GridHeader'>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-md-3 cursor-pointer' title='Sort by Name' onClick={() => handleSorting('name')}>
                        Name<FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2 cursor-pointer ' title='Sort by Contact Number' onClick={() => handleSorting('contact_no')}>
                        Contact <FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2  cursor-pointer' title='Sort by Source' onClick={() => handleSorting('source')}>
                        Source<FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2 cursor-pointer ' title='Sort by Email' onClick={() => handleSorting('email')}>
                        Email<FontAwesomeIcon icon={faArrowUpAZ} className='ps-1' />
                    </div>
                    <div className='col-md-2 text-center'>Action</div>
                </div>
            </div>
            <div className="parent-container">
                <div className=''>
                    {LeadData.length ? LeadData.map((item, index) => {
                        var statuscolor = "";
                        if (item.status_id == 1) statuscolor = "blue_dot";
                        else if (item.status_id == 2) statuscolor = "navyblue_dot";
                        else if (item.status_id == 3) statuscolor = "green_dot";
                        else if (item.status_id == 4) statuscolor = "yellow_dot";
                        else if (item.status_id == 5) statuscolor = "red_dot";
                        return <div className='row GridData' key={index}>
                            <div className='col-md-1'>
                                <label className={statuscolor}></label>
                            </div>
                            <div className='col-md-3'>
                                <div className='col-12 d-flex align-items-center'>
                                    {item.entity_type == 2 && (
                                        <img src={Images.profile_icon_white} className='pe-2 iconsize' />
                                    )}
                                    {item.name}
                                </div>
                                <div className='col-12 d-flex mt-2 ps-0'>
                                    {item.tags.length > 0 && (
                                        item.tags.map((tag, tagindex) => {
                                            return <label className="tags_label font-12 me-1" key={tagindex}>
                                                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                                            </label>
                                        })
                                    )}
                                </div>
                            </div>
                            <div className='col-md-2'>{item.contact_no}</div>
                            <div className='col-md-2 '>{item?.lead_source ? item?.lead_source?.name : '-'}</div>
                            <div className='col-md-2'>{item.email || '-'}</div>
                            <div className='col-md-2 text-center'>
                                <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Lead'
                                    onClick={(e) => navigate('/add-update-leads', { state: { leadid: item.id } })} />
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

            <CustomModal isShow={InfoPopup} size={"lg"} title={"Lead Information"}
                bodyContent={<LeadInformationPopup LeadInfoData={LeadInfoData} />} closePopup={(e) => setInfoPopup(false)} showBudget={false} />
        </div >
    )
}
