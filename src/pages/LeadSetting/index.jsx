import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'react-bootstrap/Accordion';
import Csv from './Csv';
import { useNavigate } from 'react-router-dom';
import WebForm from './WebForm';
import useAuth from '../../hooks/useAuth';

export default function LeadSettingIndex() {
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
            <div className='scrollable-content'>
                <div className='row m-auto justify-content-center'>
                    <div className='d-flex pt-4 justify-content-center'>
                        <div className='col-md-4 square-boxes'>
                            <b>Client ID</b>
                            <div className='row align-items-center pt-2'>
                                <label className='col-md-10 font-13'>{userDetails.client_id}</label>
                                <label className='col-md-2'><FontAwesomeIcon className='cursor-pointer' icon={faCopy} onClick={(e) => handleCopyClick(userDetails.client_id)} /></label>
                            </div>
                        </div>
                        <div className='col-md-4 ms-4 square-boxes'>
                            <b>Client Secret</b>
                            <div className='row align-items-center pt-2'>
                                <label className='col-md-10 font-13'>
                                    {visiblesecretkey ? userDetails.client_secret_key : getMaskedSecretKey(userDetails.client_secret_key)}
                                </label>
                                <label className='col-md-2 d-flex ps-0 justify-content-between'>
                                    <span className="cursor-pointer" onClick={togglePasswordVisibility}>
                                        {visiblesecretkey ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                    </span>
                                    <label ><FontAwesomeIcon className='cursor-pointer' icon={faCopy} onClick={(e) => handleCopyClick(userDetails.client_secret_key)} /></label>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='text-center'>
                        {showcopymsg && <label className="pt-2 fontwhite">Copied!</label>}
                    </div>
                    <div className='col-12 fontwhite font-22 text-center pt-5'>
                        You may choose any option to add leads.
                    </div>
                    <div className='col-md-9 mt-2'>
                        <Accordion className='leadaccordian'>
                            <Accordion.Item eventKey="0" className='my-3'>
                                <Accordion.Header className='font-weight-bold'>Rest API</Accordion.Header>
                                <Accordion.Body>
                                    Click on the <label className='fw-bold cursor-pointer' onClick={(e) => navigate("/rest-api")}>REST API</label> link for more information.
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1" className='my-3'>
                                <Accordion.Header>Web Form</Accordion.Header>
                                <Accordion.Body>
                                    <WebForm />
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2" className='my-3'>
                                <Accordion.Header>CSV</Accordion.Header>
                                <Accordion.Body>
                                    <Csv />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
            </div>
        </>
    )
}
