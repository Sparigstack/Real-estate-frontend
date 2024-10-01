import React from 'react'
import HeaderName from '../../utils/HeaderName'

export default function RecentLeads({ setGridFlag }) {
    return (
        <>
            <HeaderName header="Recent Leads" />
            <div className='row align-items-center'>
                <div className='col-md-6'>
                    <h6 className='mb-0 fw-bold'>Recent Leads</h6>
                </div>
                <div className='col-md-6 text-end'>
                    <button type="submit" className='WhiteBtn'>Mass Email</button>
                    <label className='text-decoration-underline fontwhite cursor-pointer ms-3' onClick={(e) => setGridFlag(2)}>All Leads</label>
                </div>
            </div>
        </>
    )
}
