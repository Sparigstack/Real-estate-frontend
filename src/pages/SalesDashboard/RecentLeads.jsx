import React, { useEffect, useState } from 'react'
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';
import Cookies from 'js-cookie';

export default function RecentLeads() {
    const [recentInterstedLeads, setRecentInterstedLeads] = useState([]);
    const { getAPIAuthKey } = useApiService();
    const userid = Cookies.get('userId');
    const { schemeId } = useProperty();
    useEffect(() => {
        getRecentInterstedLeads();
    }, []);
    const getRecentInterstedLeads = async () => {
        try {
            const result = await getAPIAuthKey(`/get-recent-interested-leads/${userid}/${schemeId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setRecentInterstedLeads(responseRs);
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div className='PageHeader p-2' style={{ height: "100%" }}>
            <label className='pb-3 pt-2'>Recent Intersted Leads</label>
            <div className='smallgridheader'>
                <div className='row'>
                    <div className='col-md-3'>
                        Name
                    </div>
                    <div className='col-md-3'>
                        Source
                    </div>
                    <div className='col-md-3'>
                        Contact No.
                    </div>
                    <div className='col-md-3'>
                        Wing & Unit
                    </div>
                </div>
            </div>
            {recentInterstedLeads.length > 0 ?
                recentInterstedLeads.map((lead, index) => {
                    return <div className='smallgriddata' key={index}>
                        <div className='row'>
                            <div className='col-md-3 font-13'>
                                {lead.lead_customer_name}
                            </div>
                            <div className='col-md-3 font-13'>
                                {lead.source_name}
                            </div>
                            <div className='col-md-3 font-13'>
                                {lead.contact_number}
                            </div>
                            <div className='col-md-3 font-13'>
                                {lead.wing_name} - {lead.unit_name}
                            </div>
                        </div>
                    </div>
                })
                :
                <div className='text-center'>No Data Found</div>
            }
        </div>
    )
}
