import React from 'react'
import HeaderName from '../../utils/HeaderName'

export default function RecentLeads({ setGridFlag }) {
    return (
        <>
            <HeaderName header="Recent Leads" />
            <div className='col-12 align-items-center text-end'>
                <button type="submit" className='WhiteBtn'>Mass Email</button>
                <label className='text-decoration-underline fontwhite cursor-pointer ms-3' onClick={(e) => setGridFlag(2)}>All Leads</label>
            </div>
        </>
    )
}
