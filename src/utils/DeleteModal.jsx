import React from 'react'
import { Modal } from 'react-bootstrap'
import Images from './Images'

export default function DeleteModal(props) {
    return (
        <Modal show={props.isShow} size="md">
            <div className='p-5 text-center'>
                <img src={Images.red_info} className='pb-3' style={{ height: "80px" }} />
                <h4 className='fw-semibold'>{props.title}</h4>
                <div className='col-12 text-center pt-3'>
                    <button className="dangerCancelBtn me-3" onClick={(e) => props.Cancel()}>{props.canceltext}</button>
                    <button className="RedSuccessBtn" onClick={props.handleSuccess}>{props.successtext}</button>
                </div>
            </div>
        </Modal>
    )
}
