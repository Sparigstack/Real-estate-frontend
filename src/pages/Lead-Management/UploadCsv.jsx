import React from 'react'
import { useNavigate } from 'react-router-dom';
import Csv from '../LeadSetting/Csv';
import Excel from '../LeadSetting/Excel';

export default function UploadCsv() {
    const navigate = useNavigate();
    return (
        <>
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => navigate('/all-leads')}>All Leads /</label> Upload CSV or Excel</div>
                </div>
            </div>
            <div className='m-2 row'>
                <Csv />
                <Excel />
            </div>
        </>
    )
}
