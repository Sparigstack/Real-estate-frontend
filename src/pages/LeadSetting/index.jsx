import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export default function LeadSettingIndex() {
    const { userDetails } = useContext(UserContext);
    return (
        <div className='row m-auto justify-content-center'>
            <div className='d-flex pt-4 justify-content-center'>
                <div className='col-md-4 square-boxes'>
                    <b>Client ID</b>
                    <div className='row align-items-center'>
                        {/* <label className='col-md-10 font-13'>{userDetails.client_id}</label> */}
                        <label className='col-md-2'><FontAwesomeIcon icon={faCopy} /></label>
                    </div>
                </div>
                <div className='col-md-4 ms-4 square-boxes'>
                    <b>Client Secret</b>
                    <br />
                    {/* <label className='font-13'>{userDetails.client_secret_key}</label> */}
                </div>
            </div>
        </div>
    )
}
