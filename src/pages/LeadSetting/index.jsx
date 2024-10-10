import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'react-bootstrap/Accordion';
import Csv from './Csv';
import { useNavigate } from 'react-router-dom';
import WebForm from './WebForm';
import useAuth from '../../hooks/useAuth';

export default function LeadSettingIndex({ setGridFlag }) {
    const { userDetails } = useAuth();
    const [showcopymsg, setshowcopymsg] = useState(false)
    const [visiblesecretkey, setvisiblesecretkey] = useState(false)
    const navigate = useNavigate();
    const handleCopyClick = (labelValue) => {
        navigator.clipboard.writeText(labelValue);
        setshowcopymsg(true);
        setTimeout(() => setshowcopymsg(false), 2000);
    };
    const togglePasswordVisibility = () => {
        setvisiblesecretkey(!visiblesecretkey);
    };
    const getMaskedSecretKey = (key) => {
        return '•'.repeat(key.length);
    };
    return (
        <>
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => setGridFlag(2)}>All Leads /</label> Lead Setting</div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-md-6' >
                    <div className='square-boxes' style={{ height: "100%" }}>
                        <div className='col-12 fw-semibold'>
                            Web Form
                        </div>
                        <hr />
                        <WebForm />
                    </div>
                </div>
                <div className='col-md-6 ' >
                    <div className='square-boxes' style={{ height: "100%" }}>
                        <div className='col-12 fw-semibold'>
                            Upload CSV
                        </div>
                        <hr />
                        <Csv />
                    </div>
                </div>
                <div className='col-12 my-3' >
                    <div className='square-boxes' style={{ height: "100%" }}>
                        <div className='col-12 fw-semibold'>
                            Rest API
                        </div>
                        <hr />
                        <div className='row align-items-center'>
                            <div className='col-md-3 pe-0'>
                                <b>Client ID : </b>
                            </div>
                            <div className='col-md-7'>
                                <label className='font-13'>&nbsp;{userDetails.client_id}</label>
                            </div>
                            <div className='col-md-2 text-end'>
                                <label className='text-end ps-5'><FontAwesomeIcon className='cursor-pointer' icon={faCopy} onClick={(e) => handleCopyClick(userDetails.client_id)} /></label>
                            </div>
                        </div>
                        <div className='row pt-2 align-items-center'>
                            <div className='col-md-3 pe-0'>
                                <b>Client Secret : </b>
                            </div>
                            <div className='col-md-7'>
                                <label className='font-13'>&nbsp; {visiblesecretkey ? userDetails.client_secret_key : getMaskedSecretKey(userDetails.client_secret_key)}</label>
                            </div>
                            <div className='col-md-2 text-end'>
                                <span className="cursor-pointer" onClick={togglePasswordVisibility}>
                                    {visiblesecretkey ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </span>
                                <label className='ps-2'><FontAwesomeIcon className='cursor-pointer' icon={faCopy} onClick={(e) => handleCopyClick(userDetails.client_secret_key)} /></label>
                            </div>
                        </div>
                        <div className='text-center'>
                            {showcopymsg && <label className="pt-2 fontwhite">Copied!</label>}
                        </div>
                        <div className='pt-2'>
                            Click on the <label className='fw-bold cursor-pointer' onClick={(e) => navigate("/rest-api")}>REST API</label> link for more information.
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
