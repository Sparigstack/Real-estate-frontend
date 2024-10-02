import React from 'react'
import HeaderName from '../../utils/HeaderName'
import Images from '../../utils/Images'

export default function RecentLeads({ setGridFlag }) {
    return (
        <>
            <HeaderName header="Recent Leads" />
            <div className='col-12 d-flex justify-content-end align-items-center font-13 '>
                <div className='fontwhite d-flex align-items-center cursor-pointer px-2'>
                    <img src={Images.emailicon} className='img-fluid pe-2' />
                    Mass Email
                </div>
                <div className='fontwhite d-flex align-items-center cursor-pointer px-2' onClick={(e) => setGridFlag(2)}>
                    <img src={Images.people} className='img-fluid pe-2' />
                    All Leads
                </div>
            </div>
        </>
    )
}
