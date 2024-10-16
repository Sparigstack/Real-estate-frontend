import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Modal } from 'react-bootstrap'

export default function CustomModal(props) {
    return (
        <Modal show={props.isShow} size={props.size}>
            <Modal.Header className='d-flex justify-content-between'>
                <Modal.Title>
                    <b className='font-16'>{props.title}</b>
                </Modal.Title>
                <FontAwesomeIcon icon={faTimes} className='cursor-pointer' onClick={props.closePopup} />
            </Modal.Header>
            <Modal.Body>
                {props.bodyContent}
            </Modal.Body>
            {props.footerButtons &&
                <Modal.Footer>
                    {props.footerButtons.map((button, index) => (
                        <button
                            key={index}
                            className={button.btnColor}
                            onClick={button.onClick}>
                            {button.label}
                        </button>
                    ))}
                </Modal.Footer>
            }
        </Modal>
    )
}
