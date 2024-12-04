import React from 'react'
import { useNavigate } from 'react-router-dom';
import Csv from '../LeadSetting/Csv';

export default function UploadCsv() {
    const navigate = useNavigate();
    return (
        <>
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => navigate('/all-leads')}>All Leads /</label> Upload CSV or Excel</div>
                </div>
            </div>
            <div style={{ textAlign: "justify", border: "1px solid #484155" }} className='p-3 m-3'>
                <Csv />
            </div>
        </>
    )
}
