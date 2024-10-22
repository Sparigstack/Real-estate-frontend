import React from 'react'
import { Modal } from 'react-bootstrap'
import Images from './Images'

export default function DeleteModal(props) {
    return (
        <Modal show={props.isShow} size="md">
            <div className='p-5 text-center'>
                <img src={Images.redInfo} className='pb-3' />
                <h4>{props.title}</h4>
                <div className='col-12 text-center py-3'>
                    <button className="CancelBtn me-3" onClick={(e) => props.Cancel()}>Cancel</button>
                    <button className="RedSuccessBtn" onClick={props.handleSuccess}>Confirm</button>
                </div>
            </div>
        </Modal>
    )
}
