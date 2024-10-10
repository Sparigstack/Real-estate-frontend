import React from 'react'
import Images from '../../utils/Images'

export default function RecentLeads({ setGridFlag }) {
    return (
        <>
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6 '>Recent Leads</div>
                    <div className='col-6'>
                        <div className='col-12 d-flex justify-content-end align-items-center font-13 '>
                            <div className='fontwhite d-flex align-items-center cursor-pointer px-2' onClick={(e) => setGridFlag(2)}>
                                <img src={Images.people} className='img-fluid pe-2' />
                                All Leads
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
