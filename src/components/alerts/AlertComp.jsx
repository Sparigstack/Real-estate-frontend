import React from 'react'
import { Alert } from 'react-bootstrap'
import Images from '../../utils/Images'

export default function AlertComp({ show, variant, message }) {
    return (
        <>
            <Alert show={show} variant={variant} className='alertClass d-flex align-items-center'>
                {variant == "success" ?
                    <img src={Images.alert_success} className='pe-2' />
                    :
                    <img src={Images.alert_danger} className='pe-2' />
                }
                {message}
            </Alert>
        </>
    )
}

