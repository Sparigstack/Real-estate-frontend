import React, { useState } from 'react'
import RecentLeads from './RecentLeads'
import AllLeads from './AllLeads';

export default function LeadManagementIndex() {
    const [GridFlag, setGridFlag] = useState(1); //1->RecentLeads 2->AllLeads
    return (
        <div className='overflowXHidden'>
            {GridFlag == 1 ?
                <RecentLeads setGridFlag={setGridFlag} />
                : GridFlag == 2 ?
                    <AllLeads setGridFlag={setGridFlag} /> :
                    <></>}
        </div>
    )
}
