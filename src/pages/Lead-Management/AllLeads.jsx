import { faIndianRupeeSign, faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Images from '../../utils/Images'
import { formatCurrency } from '../../utils/js/Common'
import CustomModal from '../../utils/CustomModal'
import AddUpdateLead from './AddUpdateLead'
import ShowLoader from '../../components/loader/ShowLoader'
import HideLoader from '../../components/loader/HideLoader'
import useApiService from '../../services/ApiService'
import Cookies from 'js-cookie'
import AlertComp from '../../components/AlertComp'
import CustomPagination from '../../components/CustomPagination'
import { debounce } from 'lodash';
import HeaderName from '../../utils/HeaderName'

export default function AllLeads() {
    const { postAPI, getAPI } = useApiService();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [LeadPopup, setLeadPopup] = useState(false);
    const [LeadNotesPopup, setLeadNotesPopup] = useState(false);
    const [LeadData, setLeadData] = useState([]);
    const [LeadNotes, setLeadNotes] = useState('');
    const [AddUpdateFlag, setAddUpdateFlag] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        source: 0,
        propertyinterest: 0,
        budget: '',
        contactno: '',
        leadid: 0
    });
    const [utils, setUtils] = useState({
        search: null,
        sortbykey: 'desc',
        sortbyvalue: null,
    })
    const userId = Cookies.get('userId');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState('');
    var itemsPerPage = 5;

    const debouncedSearch = useCallback(debounce((searchValue) => {
        getAllLeads(searchValue, utils.sortbyvalue);
    }, 500), [utils.sortbyvalue, currentPage]);

    useEffect(() => {
        getAllLeads(utils.search, utils.sortbyvalue);
    }, [currentPage]);

    const getAllLeads = async (search = '', sortbyvalue = null) => {
        try {
            const sortby = utils.sortbykey == 'asc' ? 'desc' : 'asc';
            setLoading(true);
            const result = await getAPI(`/get-leads/${userId}&${search}&${sortby}&${sortbyvalue}&${currentPage}&${itemsPerPage}`, 3);
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
            const raw = JSON.stringify({ ...values, leadid: formData.leadid });
            const result = await postAPI('/add-edit-leads', raw, 3);

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
                    setShowAlerts(<AlertComp show={false} />);
                    getAllLeads();
                }, 2000);
            }
            else {
                showErrorAlert(responseRs.msg);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const showErrorAlert = (message) => {
        setShowAlerts(<AlertComp show={true} variant="danger" message={message} />);
        setTimeout(() => setShowAlerts(<AlertComp show={false} />), 2000);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            var formdata = new FormData();
            formdata.append("file", file);
            const result = await postAPI('/add-leads-csv', formdata, 1);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == "success") {
                setShowAlerts(<AlertComp show={true} variant="success" message={'CSV imported Successfully'} />);
                fileInputRef.current.value = '';
                setTimeout(() => {
                    setShowAlerts(<AlertComp show={false} />);
                    getAllLeads();
                }, 1500);
            } else {
                showErrorAlert(responseRs.message);
            }
        } catch (error) {
            setLoading(false);
            console.log('error', error);
        }
    };

    const handleButtonClick = () => fileInputRef.current?.click();

    const getLeadById = async (leadid) => {
        if (!leadid) return;
        setLoading(true);
        try {
            const result = await getAPI(`/fetch-lead-detail/${userId}/${leadid}`, 3);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLeadPopup(true);
            setLoading(false);
            setFormData({ ...formData, ...responseRs, leadid: responseRs.id });
            setAddUpdateFlag(2)
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const notesbody = (
        <div className='row px-3'>
            <textarea rows={5} className='form-control' value={LeadNotes} onChange={(e) => setLeadNotes(e.target.value)} />
        </div>
    )
    function handleHideNotes() {
        setLeadNotesPopup(false);
        setLeadNotes("");
    }
    async function handleSaveNotes() {
        if (!LeadNotes) return setLeadNotesPopup(false);
        setLoading(true);
        const raw = JSON.stringify({ leadid: formData.leadid, notes: LeadNotes });
        try {
            const result = await postAPI('/update-lead-notes', raw, 3);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == 'success') {
                setLeadNotesPopup(false)
                setShowAlerts(<AlertComp show={true} variant="success" message={'Notes Added Successfully'} />);
                setTimeout(() => {
                    setLoading(false);
                    setShowAlerts(<AlertComp show={false} />);
                    getAllLeads();
                }, 2000);
            }
            else {
                showErrorAlert(responseRs.msg);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handlePageChange = (page) => setCurrentPage(page);
    return (
        <div>
            <HeaderName header="Recent Leads / All Leads" />
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='row align-items-center'>
                <div className='col-md-4'>
                    <div className="position-relative">
                        <img src={Images.searchIcon} alt="search-icon" className="search-icon" />
                        <input
                            type="text"
                            className="form-control searchInput"
                            placeholder="Search"
                            onChange={(e) => {
                                debouncedSearch(e.target.value);
                                setUtils({ ...utils, search: e.target.value })
                            }}
                        />
                    </div>
                </div>
                <div className='col-md-8 text-end'>
                    <a className='font-13 text-decoration-underline pe-2 cursor-pointer fontwhite'
                        href="/csv/lead_csv.csv"
                        download="Lead.csv"
                    >Template CSV</a>
                    <button type="submit" className='WhiteBtn' onClick={(e) => {
                        setLeadPopup(true); setFormData({
                            ...formData,
                            name: '',
                            email: '',
                            source: 0,
                            propertyinterest: 0,
                            budget: '',
                            contactno: '',
                            leadid: 0
                        });
                        setAddUpdateFlag(1)
                    }}>
                        Add Lead
                    </button>
                    <button type="submit" className='WhiteBtn ms-3'>Mass Email</button>
                    <button className='WhiteBtn ms-3' onClick={handleButtonClick}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="ms-3 cursor-pointer"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        Upload CSV
                    </button>

                </div>
            </div>
            <div className='GridHeader mt-2'>
                <div className='row'>
                    <div className='col-md-1'>
                        Status
                    </div>
                    <div className='col-md-2 cursor-pointer' title='Sort by Name' onClick={(e) => { getAllLeads(utils.search, 'name'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'name' })) }}>
                        Name<FontAwesomeIcon icon={faSort} className='ps-2' />
                    </div>
                    <div className='col-md-2 cursor-pointer' title='Sort by Email' onClick={(e) => { getAllLeads(utils.search, 'email'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'email' })) }}>
                        Email<FontAwesomeIcon icon={faSort} className='ps-2' />
                    </div>
                    <div className='col-md-2 cursor-pointer' title='Sort by Source' onClick={(e) => { getAllLeads(utils.search, 'source'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'source' })) }}>
                        Source<FontAwesomeIcon icon={faSort} className='ps-2' />
                    </div>
                    <div className='col-md-2 cursor-pointer ps-0' title='Sort by Property' onClick={(e) => { getAllLeads(utils.search, 'property'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'property' })) }}>
                        Property <FontAwesomeIcon icon={faSort} className='ps-2' />
                    </div>
                    <div className='col-md-1 cursor-pointer ps-0' title='Sort by Budget' onClick={(e) => { getAllLeads(utils.search, 'budget'); setUtils((prevdata) => ({ ...prevdata, sortbyvalue: 'budget' })) }}>
                        Budget<FontAwesomeIcon icon={faSort} className='ps-2' />
                    </div>
                    <div className='col-md-2 text-center'>Action</div>
                </div>
            </div>
            <div className="parent-container">
                <div className='hide-scrollbar'>
                    {LeadData.length ? LeadData.map((item, index) => {
                        var statuscolor = "";
                        var statusname = "";
                        if (item.status == 0) {
                            statuscolor = "#38A5EB";
                            statusname = "New";
                        } else if (item.status == 1) {
                            statuscolor = "#E0E26B";
                            statusname = "In Negotiation";
                        } else if (item.status == 2) {
                            statuscolor = "#fa89d1";
                            statusname = "In Contact";
                        } else if (item.status == 3) {
                            statuscolor = "#79E07D";
                            statusname = "Highly Interested";
                        } else if (item.status == 4) {
                            statuscolor = "#D45959";
                            statusname = 'Closed'
                        }
                        return <div className='row GridData' key={index}>
                            <div className='col-md-1'>
                                <label style={{ color: `${statuscolor}` }} className={`me-2 font-12`}>{statusname}</label>
                            </div>
                            <div className='col-md-2 ps-3'>
                                {item.name}<br />({item.contact_no})
                            </div>
                            <div className='col-md-2'>{item.email}</div>
                            <div className='col-md-2 '>{item?.lead_source?.name}</div>
                            <div className='col-md-2'>{item?.userproperty?.name}</div>
                            <div className='col-md-1'>
                                <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1' />
                                {formatCurrency(item.budget)}
                            </div>
                            <div className='col-md-2 text-center'>
                                <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Lead'
                                    onClick={(e) => getLeadById(item.id)} />
                                <img src={Images.gridMsg} className='cursor-pointer iconsize me-2' title='Add Notes'
                                    onClick={(e) => { setLeadNotesPopup(true); setLeadNotes(item.notes); setFormData({ ...formData, leadid: item.id }) }} />
                                <a href={`mailto:${item.email}`} target="_blank" rel="noopener noreferrer">
                                    <img src={Images.gridMail} className='cursor-pointer iconsize' title='Contact using Mail' />
                                </a>
                            </div>
                        </div>
                    })
                        :
                        <div className='row text-center'>
                            <label className='norecorddiv'>No Leads Found</label>
                        </div>
                    }
                </div>
                <CustomPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} handlePageChange={handlePageChange} />
            </div>
            <CustomModal isShow={LeadPopup} size={"lg"} title="Add Lead"
                bodyContent={<AddUpdateLead formData={formData} setFormData={setFormData} handleAddLead={handleAddLead} handleHide={handleHide} />} />

            <CustomModal isShow={LeadNotesPopup} size={"md"} title="Add Lead Notes" closePopup={handleHideNotes}
                bodyContent={notesbody} footerButtons={[
                    { btnColor: 'CancelBtn', onClick: handleHideNotes, label: "Cancel" },
                    { btnColor: 'SuccessBtn', onClick: handleSaveNotes, label: "Save" }
                ]} />
        </div >
    )
}
