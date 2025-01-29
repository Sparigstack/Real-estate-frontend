import React from 'react'
import { Alert } from 'react-bootstrap'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export default function UpgradePlanAlerts({ show, data, onhide, previousPath }) {
    const navigate = useNavigate();
    return (
        <Alert show={show} className='alert-light upgradeplan_alerts'>
            <div className='row upgradeplan_link px-0'>
                <div className='col-1'>
                    <img src={Images.red_info} className='bigiconsize' />
                </div>
                <div className='col-10 ps-4'>
                    <h6 className='fw-meidum text-start font-14 mb-0'>
                        You have reached your {data.activeplanname} plan limit..!!
                    </h6>
                    <div className='font-14 col-6 pt-1 d-flex align-items-center fw-semibold cursor-pointer'
                        style={{ borderBottom: "1px solid #03053D" }}
                        onClick={(e) => navigate('/plan-pricing', { state: { moduleid: data.moduleid, previousPath: previousPath } })}>
                        <img src={Images.blue_upgrade_plan} className='iconsize pe-1' />
                        Upgrade Plan
                    </div>
                </div>
                <div className='col-1 text-end'>
                    <FontAwesomeIcon icon={faXmark} onClick={onhide} />

                </div>
            </div>
        </Alert>
    )
}
