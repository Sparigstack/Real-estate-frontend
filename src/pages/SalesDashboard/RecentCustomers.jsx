import React, { useEffect, useState } from 'react'
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

export default function RecentCustomers() {
    const [recentCustomers, setRecentCustomers] = useState([]);
    const { getAPIAuthKey } = useApiService();
    const userid = Cookies.get('userId');
    const { schemeId } = useProperty();
    const navigate = useNavigate();
    useEffect(() => {
        getRecentCustomers();
    }, []);
    const getRecentCustomers = async () => {
        try {
            const result = await getAPIAuthKey(`/get-recent-customers/${userid}/${schemeId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setRecentCustomers(responseRs);
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div className='PageHeader p-2'>
            <div className='row pb-3 pt-2'>
                <div className='col-10'> Recent Customers</div>
                <div className='col-2 text-end text-decoration-underline 
                fw-medium colorAAB8FF cursor-pointer' onClick={(e) => navigate('/all-leads', { state: { fromSalesdashboard: true } })}>
                    See All
                </div>
            </div>
            <div className='smallgridheader'>
                <div className='row'>
                    <div className='col-md-2'>
                        Name
                    </div>
                    <div className='col-md-2'>
                        Contact No.
                    </div>
                    <div className='col-md-2 text-center'>
                        Wing & Unit
                    </div>
                    <div className='col-md-2'>
                        Source
                    </div>
                    <div className='col-md-2'>
                        Paid Amount
                    </div>
                    <div className='col-md-2'>
                        Total Amount
                    </div>
                </div>
            </div>
            {recentCustomers.length > 0 ?
                recentCustomers.map((customer, index) => {
                    var paymentPercentage = 0;
                    if (customer.amount_received > 0) {
                        paymentPercentage = Math.round((6000 / customer.total_amount) * 100);
                    }
                    return <div key={index} className='smallgriddata'>
                        <div className='row'>
                            <div className='col-md-2 font-13'>
                                {customer.name}
                                <br />
                                {customer.email}
                            </div>
                            <div className='col-md-2 font-13'>
                                {customer.contact_no}
                            </div>
                            <div className='col-md-2 font-13 text-center'>
                                {customer.wing_name} - {customer.unit_name}
                            </div>
                            <div className='col-md-2 font-13'>
                                {customer.source_name}
                            </div>
                            <div className='col-md-2 font-13'>
                                <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                                {customer.amount_received || 0}
                            </div>
                            <div className='col-md-2 font-13'>
                                <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1 font-12' />
                                {customer.total_amount || 0}
                            </div>
                        </div>
                    </div>
                })
                : <div className='text-center pt-3'>No recent customers found</div>
            }
        </div>
    )
}
