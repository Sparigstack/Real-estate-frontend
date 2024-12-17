import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Images from '../../utils/Images'
import CustomModal from '../../utils/CustomModal'
import CustomPagination from '../../components/pagination/CustomPagination'
import { debounce } from 'lodash';
import useApiService from '../../hooks/useApiService'
import useProperty from '../../hooks/useProperty'
import Loader from '../../components/loader/Loader'
import { useNavigate } from 'react-router-dom'
import LeadInformationPopup from './LeadInformationPopup'
import useCommonApiService from '../../hooks/useCommonApiService'

export default function AllLeads() {
    const { getAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const navigate = useNavigate();
    const { getLeadStatus, getLeadTags } = useCommonApiService();
    const searchInputRef = useRef(null);

    const [leadStatuses, setleadStatuses] = useState([]);
    const [CustomFieldData, setCustomFieldData] = useState([]);
    const [AllTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [LeadData, setLeadData] = useState([]);
    const [InfoPopup, setInfoPopup] = useState(false);
    const [utils, setUtils] = useState({
        search: null,
        sortbykey: 'desc',
        sortbyvalue: null,
        statusid: null,
        customfieldid: null,
        tagid: null
    })
    const [activeTab, setActiveTab] = useState(1)
    const [currentPage, setCurrentPage] = useState(1);
    const [LeadInfoData, setLeadInfoData] = useState('');
    const [totalItems, setTotalItems] = useState('');
    const [customfieldname, setCustomfieldname] = useState('');
    var itemsPerPage = 8;

    const debouncedSearch = useCallback(debounce((searchValue) => {
        getAllLeads(searchValue, utils.sortbyvalue, utils.statusid, utils.sortbykey, utils.customfieldid, utils.tagid, currentPage);
    }, 500), []);

    useEffect(() => {
        const fetchStatus = async () => {
            const sources = await getLeadStatus();
            setleadStatuses(sources)
        }
        const getTags = async () => {
            const sources = await getLeadTags();
            setAllTags(sources)
        }
        const getAllCustomFields = async () => {
            try {
                const result = await getAPIAuthKey(`/get-custom-fields/` + schemeId);
                if (!result) {
                    throw new Error('Something went wrong');
                }
                const responseRs = JSON.parse(result);
                setCustomFieldData(responseRs);
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        getAllCustomFields();
        fetchStatus();
        getTags();
    }, []);

    useEffect(() => {
        getAllLeads(null, null, null, null, null, null, 1);
        setUtils({
            ...utils, search: '', sortbykey: 'desc', sortbyvalue: null, statusid: null,
            customfieldid: null, tagid: null
        })
    }, [activeTab]);

    const getAllLeads = async (search = '', sortbyvalue = null, statusid = null,
        sortDirection = 'asc', customfieldid = null, tagid = null, currentPage) => {
        try {
            var searchstring = search == '' ? null : search;
            setLoading(true);
            // const result = await getAPIAuthKey(`/get-leads/${schemeId}&${activeTab}&${searchstring}&${sortDirection}&${sortbyvalue}&${statusid}&${customfieldid}&${tagid}&${currentPage}&${itemsPerPage}`);
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
        getAllLeads(utils.search, utils.sortbyvalue, utils.statusid, utils.sortbykey, utils.customfieldid, utils.tagid, page);  // Preserve sorting state
    };

    const handleSorting = (sortField) => {
        const newSortDirection = utils.sortbykey == 'asc' ? 'desc' : 'asc';
        setUtils((prev) => ({ ...prev, sortbyvalue: sortField, sortbykey: newSortDirection }));
        getAllLeads(utils.search, sortField, utils.statusid, newSortDirection, utils.customfieldid, utils.tagid, currentPage); // Pass updated sort direction and value
    };

    const handleCancelActiveTabs = () => {
        setActiveTab(1);
        setUtils({
            ...utils, search: '', sortbykey: 'desc',
            sortbyvalue: null, statusid: null, customfieldid: null,
            tagid: null
        })
    }
    const handleCustomFieldChange = (e) => {
        getAllLeads(utils.search, utils.sortbyvalue, utils.statusid, utils.sortbykey, e.target.value, utils.tagid, currentPage);
        setUtils((prevdata) => ({ ...prevdata, customfieldid: e.target.value }))
        const selectedField = CustomFieldData.find((item) => item.id == e.target.value);
        const fieldName = selectedField ? selectedField.name : '';
        setCustomfieldname(fieldName)
        if (e.target.value != "null") {
            searchInputRef.current?.focus();
        }
    }
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
                <div className='col-md-3'>
                    <div className='tab_bg'>
                        <div className='row align-items-center px-2'>
                            <div className={`col-5 ${activeTab == 2 && "active_tab"}  cursor-pointer`}
                                onClick={(e) => { setActiveTab(2) }}>Members</div>
                            <div className={`col-6 ${activeTab == 3 && "active_tab"}  cursor-pointer`}
                                onClick={(e) => { setActiveTab(3); }}>Non-Members</div>
                            <div className='col-1 ps-0'>
                                {activeTab != 1 && (
                                    <img src={Images.white_cancel} className='cursor-pointer'
                                        onClick={handleCancelActiveTabs} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <select className="customInput" name='status' style={{ background: "#03053d", padding: '0.7em' }}
                        onChange={(e) => {
                            getAllLeads(utils.search, utils.sortbyvalue, e.target.value, utils.sortbykey, utils.customfieldid, utils.tagid, currentPage);
                            setUtils((prevdata) => ({ ...prevdata, statusid: e.target.value }))
                        }}>
                        <option value="null" label="Filter by Status" />
                        {leadStatuses?.map((item, index) => {
                            return <option value={item.id} label={item.name} key={index} />
                        })}
                    </select>
                </div>
                <div className='col-md-3'>
                    <select className="customInput" name='status' style={{ background: "#03053d", padding: '0.7em' }}
                        onChange={(e) => handleCustomFieldChange(e)}>
                        <option value="null" label="Filter by Custom Field" />
                        {CustomFieldData?.map((item, index) => {
                            return <option value={item.id} label={item.name} key={index} />
                        })}
                    </select>
                </div>
                <div className='col-md-3'>
                    <div className="position-relative">
                        <img src={Images.searchIcon} alt="search-icon" className="search-icon" />
                        <input
                            type="text"
                            ref={searchInputRef}
                            className="form-control searchInput"
                            placeholder={`Search ${customfieldname}`}
                            value={utils.search}
                            onChange={(e) => {
                                debouncedSearch(e.target.value);
                                setUtils({ ...utils, search: e.target.value })
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='row py-2'>
                <div className='col-12 pb-2'>
                    <label className='fw-semibold fontwhite'>Recommended</label>
                </div>
                <div className='col-12 d-flex ps-4'>
                    {AllTags.length > 0 && (
                        AllTags.map((tag, tagindex) => {
                            return <label className="tags_label cursor-pointer font-12 me-2 px-2" key={tagindex}
                                onClick={(e) => {
                                    getAllLeads(utils.search, utils.sortbyvalue, utils.statusid, utils.sortbykey, utils.customfieldid, tag.id, currentPage);
                                    setUtils((prevdata) => ({ ...prevdata, tagid: e.target.value }))
                                }}>
                                {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                            </label>
                        })
                    )}
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
                        if (item.status_id == 1) statuscolor = "blue_text";
                        else if (item.status_id == 2) statuscolor = "navyblue_text";
                        else if (item.status_id == 3) statuscolor = "green_text";
                        else if (item.status_id == 4) statuscolor = "yellow_text";
                        else if (item.status_id == 5) statuscolor = "red_text";
                        return <div className='row GridData' key={index}>
                            <div className='col-md-1 font-10'>
                                <label className={statuscolor}>
                                    {item?.lead_status?.name}
                                </label>
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
