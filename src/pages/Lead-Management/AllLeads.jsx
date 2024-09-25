import { faAngleLeft, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import Images from '../../utils/Images'
import { formatCurrency } from '../../utils/js/Common'
import CustomModal from '../../utils/CustomModal'
import AddUpdateLead from './AddUpdateLead'
import ShowLoader from '../../components/loader/ShowLoader'
import HideLoader from '../../components/loader/HideLoader'
import useApiService from '../../services/ApiService'
import Cookies from 'js-cookie'

export default function AllLeads({ setGridFlag }) {
    const { postAPI, getAPI } = useApiService();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [LeadPopup, setLeadPopup] = useState(false);
    const [LeadData, setLeadData] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        source: 0,
        propertyinterest: 0,
        budget: '',
        contactno: '',
        leadid: 0
    });
    const userId = Cookies.get('userId');
    useEffect(() => {
        getAllLeads();
    }, []);
    const getAllLeads = async () => {
        try {
            const result = await getAPI(`/get-leads/${userId}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setLeadData(responseRs)
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    function handleHide() {
        setLeadPopup(false);
    }
    async function handleAddLead(values) {
        setLoading(true);
        var raw = JSON.stringify({
            name: values.name,
            email: values.email,
            contactno: values.contactno,
            budget: values.budget,
            source: values.source,
            propertyinterest: values.propertyinterest,
            leadid: formData.leadid
        });
        console.log(raw)
        // try {
        //     const result = await postAPI('/register-user', raw);
        //     if (!result || result == "") {
        //         alert('Something went wrong');
        //     } else {
        //         const responseRs = JSON.parse(result);
        //         if (responseRs.status == 'success') {
        //             setLoading(false);
        //             setLeadPopup(false);
        //             setShowAlerts(<AlertComp show={true} variant="success" message={"Lead Added Successfully"} />);
        //             setTimeout(() => {
        //                 setLoading(false);
        //                 setShowAlerts(<AlertComp show={false} />);
        //             }, 2000);
        //         }
        //         else {
        //             setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.msg} />);
        //             setTimeout(() => {
        //                 setLoading(false);
        //                 setShowAlerts(<AlertComp show={false} />);
        //             }, 2000);
        //         }
        //     }
        // }
        // catch (error) {
        //     setLoading(false);
        //     console.error(error);
        // }
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("File uploaded:", file);
        }
    };
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const getLeadById = async (leadid) => {
        try {
            const result = await getAPI(`/get-lead-byid/${leadid}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setLeadPopup(true);
                setFormData({
                    ...formData,
                    name: responseRs,
                    email: '',
                    source: 0,
                    propertyinterest: 0,
                    budget: '',
                    contactno: '',
                    leadid: 0
                })
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='TitleHeader '>
                <div className='row align-items-center'>
                    <div className='col-md-6'>
                        <h6 className='mb-0 fw-bold'>
                            <FontAwesomeIcon icon={faAngleLeft} className='cursor-pointer me-3'
                                onClick={(e) => setGridFlag(1)} />
                            Recent Leads / All Leads
                        </h6>
                    </div>
                    <div className='col-md-6 text-end'>
                        <button type="submit" className='WhiteBtn' onClick={(e) => setLeadPopup(true)}>Add Lead</button>
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
                        <a className='font-13 text-decoration-underline ps-2 cursor-pointer'
                            href="/csv/lead_csv.csv"
                            download="Lead.csv"
                            style={{ color: "white" }}>Template CSV</a>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-end my-3'>
                {/* 0-new, 1-negotiation, 2-in contact, 3-highly interested, 4-closed */}
                <div className='pe-4' style={{ color: "#38A5EB", fontSize: "13px" }}>
                    <label className='bluestatusicon me-2'></label>
                    New
                </div>
                <div className='pe-4' style={{ color: "#E0E26B", fontSize: "13px" }}>
                    <label className='yellowstatusicon me-2'></label>
                    In Negotiation
                </div>
                <div className='pe-4' style={{ color: "#fa89d1", fontSize: "13px" }}>
                    <label className='pinkstatusicon me-2'></label>
                    In Contact
                </div>
                <div className='pe-4' style={{ color: "#79E07D", fontSize: "13px" }}>
                    <label className='greenstatusicon me-2'></label>
                    Highly Interested
                </div>
                <div style={{ color: "#D45959", fontSize: "13px" }}>
                    <label className='redstatusicon me-2'></label>
                    Closed
                </div>
            </div>
            <div className='GridHeader'>
                <div className='row'>
                    <div className='col-md-2'>Name</div>
                    <div className='col-md-3'>Email</div>
                    <div className='col-md-2'>Source</div>
                    <div className='col-md-2'>Property Interest</div>
                    <div className='col-md-1'>Budget</div>
                    <div className='col-md-2 text-center'>Action</div>
                </div>
            </div>
            <div className="parent-container">
                <div className='hide-scrollbar'>
                    {LeadData.length > 0 ?
                        LeadData.map((item, index) => {
                            var statuscolor = "";
                            if (item.status == 0) {
                                statuscolor = "bluestatusicon";
                            } else if (item.status == 1) {
                                statuscolor = "yellowstatusicon";
                            } else if (item.status == 2) {
                                statuscolor = "pinkstatusicon";
                            } else if (item.status == 3) {
                                statuscolor = "greenstatusicon";
                            } else if (item.status == 4) {
                                statuscolor = "redstatusicon";
                            }
                            return <div className='row GridData' key={index}>
                                <div className='col-md-2 ps-3'>
                                    {item.status == 0}
                                    <label className={`${statuscolor} me-2`}></label>
                                    {item.name}<br />({item.contact_no})
                                </div>
                                <div className='col-md-3'>{item.email}</div>
                                <div className='col-md-2 '>{item?.lead_source?.name}</div>
                                <div className='col-md-2'>{item?.userproperty?.name}</div>
                                <div className='col-md-1'>
                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1' />
                                    {formatCurrency(item.budget)}
                                </div>
                                <div className='col-md-2 text-center'>
                                    <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Lead'
                                        onClick={(e) => getLeadById(item.id)} />
                                    <img src={Images.gridMsg} className='cursor-pointer iconsize me-2' title='Add Notes' />
                                    <img src={Images.gridMail} className='cursor-pointer iconsize' title='Contact using Mail' />
                                </div>
                            </div>
                        })
                        :
                        <div className='row text-center'>
                            <label className='norecorddiv'>No Leads Found</label>
                        </div>
                    }
                </div>
            </div>
            <CustomModal isShow={LeadPopup} size={"lg"} title="Add Lead" closePopup={handleHide}
                bodyContent={<AddUpdateLead formData={formData} setFormData={setFormData} handleAddLead={handleAddLead} handleHide={handleHide} />} />
        </div>
    )
}
