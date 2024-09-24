import { faAngleLeft, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState } from 'react'
import Images from '../../utils/Images'
import { formatCurrency } from '../../utils/js/Common'
import CustomModal from '../../utils/CustomModal'
import AddUpdateLead from './AddUpdateLead'
import ShowLoader from '../../components/loader/ShowLoader'
import HideLoader from '../../components/loader/HideLoader'
import useApiService from '../../services/ApiService'

export default function AllLeads({ setGridFlag }) {
    const { postAPI } = useApiService();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [LeadPopup, setLeadPopup] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        source: 0,
        propertyinterest: 0,
        budget: '',
        contactno: ''
    });
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
            propertyinterest: values.propertyinterest
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
                            Bulk Upload CSV
                        </button>
                        <a className='font-13 text-decoration-underline ps-2 cursor-pointer'
                            href="/csv/lead_csv.csv"
                            download="Lead.csv"
                            style={{ color: "white" }}>Template CSV</a>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-end my-3'>
                <div className='pe-4' style={{ color: "#79E07D", fontSize: "13px" }}>
                    <label className='greenstatusicon me-2'></label>
                    Highly Interested
                </div>
                <div className='pe-4' style={{ color: "#38A5EB", fontSize: "13px" }}>
                    <label className='bluestatusicon me-2'></label>
                    New
                </div>
                <div className='pe-4' style={{ color: "#E0E26B", fontSize: "13px" }}>
                    <label className='yellowstatusicon me-2'></label>
                    In Negotiation
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
                    <div className='row GridData'>
                        <div className='col-md-2 ps-3'>
                            <label className='greenstatusicon me-2'></label>
                            Ronak Shah<br />(9876563722)
                        </div>
                        <div className='col-md-3'>Ronakshah12@gmail.com</div>
                        <div className='col-md-2 '>Reference</div>
                        <div className='col-md-2'>The first</div>
                        <div className='col-md-1'>
                            <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1' />
                            {formatCurrency(200000)}
                        </div>
                        <div className='col-md-2 text-center'>
                            <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Lead' />
                            <img src={Images.gridMsg} className='cursor-pointer iconsize me-2' title='Add Notes' />
                            <img src={Images.gridMail} className='cursor-pointer iconsize' title='Contact using Mail' />
                        </div>
                    </div>
                    <div className='row GridData'>
                        <div className='col-md-2 ps-3'>
                            <label className='redstatusicon me-2'></label>
                            Riya<br />(1234574657)
                        </div>
                        <div className='col-md-3'>Riya123@gmail.com</div>
                        <div className='col-md-2 '>Social Media</div>
                        <div className='col-md-2'>Ganesh Glory</div>
                        <div className='col-md-1'>
                            <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1' />
                            {formatCurrency(30000000)}
                        </div>
                        <div className='col-md-2 text-center'>
                            <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Lead' />
                            <img src={Images.gridMsg} className='cursor-pointer iconsize me-2' title='Add Notes' />
                            <img src={Images.gridMail} className='cursor-pointer iconsize' title='Contact using Mail' />
                        </div>
                    </div>
                </div>
            </div>
            <CustomModal isShow={LeadPopup} size={"lg"} title="Add Lead" closePopup={handleHide}
                bodyContent={<AddUpdateLead formData={formData} setFormData={setFormData} handleAddLead={handleAddLead} handleHide={handleHide} />} />
        </div>
    )
}
