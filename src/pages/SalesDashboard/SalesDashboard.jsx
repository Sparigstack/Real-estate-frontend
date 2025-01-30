import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';
import BasicDetail from './BasicDetail';
import RecentLeads from './RecentLeads';
import RecentCustomers from './RecentCustomers';
import SalesRevenue from './SalesRevenue';
import PaymentGateway from './PaymentGateway';

export default function SalesDashboard() {
    const navigate = useNavigate();
    const { userDetails } = useAuth();
    return (
        <div>
            <div className='PageHeader'>
                <div className='row'>
                    <div className='col-md-9'>
                        Sales Dashboard
                    </div>
                    <div className='col-md-3 text-end'>
                        <label className='text-decoration-underline cursor-pointer' onClick={(e) => navigate('/sales')}>
                            Go to Sales
                        </label>
                    </div>
                </div>
            </div>
            <div className='container p-3'>
                <div className='row fontwhite'>
                    <div className='col-md-8 ps-0'>
                        <h5 className='mb-1'>Welcome {userDetails?.userName}!</h5>
                        <small className='color-D8DADCE5'>
                            Your The First Scheme Sales Dashboard Analytics & Reports.
                        </small>
                    </div>
                    {/* <div className='col-md-4 text-end pe-0'>
                        <button className='subPropertyTypeActive px-3 py-2'>Export Data</button>
                    </div> */}
                </div>
                <BasicDetail />
                <div className='row py-2'>
                    <SalesRevenue />
                </div>
                <div className='row'>
                    <div className='col-7 px-0'>
                        <RecentLeads />
                    </div>
                    <div className='col-5 pe-0'>
                        <PaymentGateway />
                    </div>
                </div>
                <div className='row mt-3'>
                    <RecentCustomers />
                </div>
            </div>
        </div>
    )
}
