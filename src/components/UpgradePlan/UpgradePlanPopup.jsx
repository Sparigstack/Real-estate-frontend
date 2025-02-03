import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Images from '../../utils/Images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function UpgradePlanPopup(props) {
    const navigate = useNavigate();
    return (
        <Modal {...props}
            size="md" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <div className='col-12 text-center'>
                    <div className='col-12 text-end'>
                        <FontAwesomeIcon icon={faXmark} onClick={props.onHide} />
                    </div>
                    <img src={Images.red_info} className='mb-4' style={{ height: "80px" }} />
                    <h5 className='fw-semibold'>
                        You have reached your {props.data.planname} plan limit..!!
                    </h5>
                    <small>
                        Want to more fast and real? Access all the features of SuperBuildup at affordable price, Upgrade your plan now!
                    </small>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='col-12 text-center'>
                    <button type='button' className='upgradeplan_btn mb-2'
                        onClick={(e) => navigate('/plan-pricing', { state: { moduleid: props.data.moduleid, previousPath: props.data.previousPath } })}>
                        <img src={Images.upgrade_plan} className=' pe-2' />
                        Upgrade Plan
                    </button>
                </div>
                <button type='button' className='upgradeplan_btn mb-4'
                    onClick={(e) => { props.getfunction && props.getfunction(); props.onHide() }}>
                    <img src={Images.upgrade_plan} className=' pe-2' />
                    Skip & Add up to {props.data.buttontext}
                </button>
            </Modal.Footer>
        </Modal>
    )
}
