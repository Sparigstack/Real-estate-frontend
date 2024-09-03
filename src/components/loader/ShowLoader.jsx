import React, { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import '../../styles/loader.css'

export default function ShowLoader() {
    useEffect(() => {
        document.body.classList.add('blur-background');
        return () => {
            document.body.classList.remove('blur-background');
        };
    }, []);

    return (
        <div className='loader-container'>
            <Spinner animation="border" style={{ height: '50px', width: '50px', zIndex:'9999' }} />
        </div>
    )
}
