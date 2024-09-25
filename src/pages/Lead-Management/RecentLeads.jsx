import React from 'react'

export default function RecentLeads({ setGridFlag }) {
    return (
        <div className='TitleHeader'>
            <div className='row align-items-center'>
                <div className='col-md-6'>
                    <h6 className='mb-0 fw-bold'>Recent Leads</h6>
                </div>
                <div className='col-md-6 text-end'>
                    <button type="submit" className='WhiteBtn'>Mass Email</button>
                    <button type="submit" className='WhiteBtn ms-3'>Upload CSV</button>
                    <label className='text-decoration-underline cursor-pointer ms-3' onClick={(e) => setGridFlag(2)}>All Leads</label>
                </div>
            </div>
        </div>
    )
}
