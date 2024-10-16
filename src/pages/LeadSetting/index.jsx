import React, { useState } from 'react'
import Csv from './Csv';
import { useNavigate } from 'react-router-dom';
import WebForm from './WebForm';
import useAuth from '../../hooks/useAuth';
import Images from '../../utils/Images';

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
        <div>
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => navigate('/all-leads')}>All Leads /</label> Lead Setting</div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-md-6' >
                    <div className='square-boxes' style={{ height: "100%" }}>
                        <div className='col-12 fw-semibold square-boxes-header'>
                            Web Form
                        </div>
                        <div className='square-boxes-body'>
                            <WebForm />
                        </div>
                    </div>
                </div>
                <div className='col-md-6 ps-0' >
                    <div className='square-boxes' style={{ height: "100%" }}>
                        <div className='col-12 fw-semibold square-boxes-header'>
                            Upload CSV
                        </div>
                        <div className='square-boxes-body'>
                            <Csv />
                        </div>
                    </div>
                </div>
                <div className='col-12 my-3' >
                    <div className='square-boxes' style={{ height: "100%" }}>
                        <div className='col-12 fw-semibold square-boxes-header'>
                            Rest API
                        </div>
                        <div className='square-boxes-body'>
                            <div className='row pe-3 ps-2 align-items-center'>
                                <div className='col-md-6 pe-3 '>
                                    <div className='row square-boxes p-2'>
                                        <div className='col-md-3 pe-0 font-14'>
                                            <b>Client ID : </b>
                                        </div>
                                        <div className='col-md-7'>
                                            <label className='font-13'>&nbsp;{userDetails.client_id}</label>
                                        </div>
                                        <div className='col-md-2 text-end'>
                                            <label className='text-end ps-5'>
                                                <img src={Images.copyicon} className='cursor-pointer iconsize' onClick={(e) => handleCopyClick(userDetails.client_id)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6 px-3 '>
                                    <div className='row square-boxes p-2'>
                                        <div className='col-md-3 pe-0 font-14'>
                                            <b>Client Secret : </b>
                                        </div>
                                        <div className='col-md-7'>
                                            <label className='font-13'>&nbsp; {visiblesecretkey ? userDetails.client_secret_key : getMaskedSecretKey(userDetails.client_secret_key)}</label>
                                        </div>
                                        <div className='col-md-2 text-end d-flex align-items-center'>
                                            <span className="cursor-pointer" onClick={togglePasswordVisibility}>
                                                {visiblesecretkey ? <img src={Images.eye} className='iconsize' /> : <img src={Images.eye_slash} className='iconsize' />}
                                            </span>
                                            <label className='ps-2'>
                                                <img src={Images.copyicon} className='cursor-pointer iconsize' onClick={(e) => handleCopyClick(userDetails.client_secret_key)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='text-center'>
                                {showcopymsg && <label className="pt-2 fontwhite">Copied!</label>}
                            </div>
                            <div className='pt-3'>
                                <div className='col-12'>
                                    <h6>Overview :</h6>
                                    <p className='m-0 font-14'>This guide will help you understand how to add a lead to our system
                                        using the REST API. You will need to make a POST request to the API endpoint,
                                        provide the required lead data in JSON format, and include authentication headers.
                                        &nbsp;
                                        <a className='fw-semibold fontwhite cursor-pointer' onClick={(e) => navigate("/rest-api")}>
                                            <i>Read More...</i>
                                        </a>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
