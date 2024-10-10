import React, { useState } from 'react'
import RecentLeads from './RecentLeads'
import AllLeads from './AllLeads';
import LeadSettingIndex from '../LeadSetting';
import UploadCsv from './UploadCsv';

export default function LeadManagementIndex() {
    const [GridFlag, setGridFlag] = useState(1); //1->RecentLeads 2->AllLeads
    return (
        <div className='overflowXHidden'>
            {GridFlag == 1 ?
                <RecentLeads setGridFlag={setGridFlag} />
                : GridFlag == 2 ?
                    <AllLeads setGridFlag={setGridFlag} />
                    : GridFlag == 3 ?
                        <LeadSettingIndex setGridFlag={setGridFlag} />
                        : GridFlag == 4 ?
                            <UploadCsv setGridFlag={setGridFlag} /> :
                            <></>}
        </div>
    )
}
