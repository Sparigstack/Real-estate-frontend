import React, { useEffect, useState } from 'react'
import useApiService from '../../hooks/useApiService';
import Cookies from 'js-cookie';
import useProperty from '../../hooks/useProperty';
import Images from '../../utils/Images';

export default function BasicDetail() {
    const { getAPIAuthKey } = useApiService();
    const userid = Cookies.get('userId');
    const { schemeId } = useProperty();
    const [basicDetails, setbasicDetails] = useState({
        available_unit: '',
        intersted_units: '',
        booked_units: '',
        payment_pending: ''
    });
    useEffect(() => {
        getSalesBasicDetails();
    }, []);
    const getSalesBasicDetails = async () => {
        try {
            const result = await getAPIAuthKey(`/get-sales-basic-details/${userid}/${schemeId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setbasicDetails({
                ...basicDetails,
                available_unit: responseRs.available_units,
                intersted_units: responseRs.interested_leads,
                booked_units: responseRs.booked_units,
                payment_pending: responseRs.payment_pending
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div className='row py-3'>
            <div className='col-md-3 ps-0'>
                <div className='PageHeader d-flex p-3 align-items-center justify-content-between'>
                    <div >
                        <label className='pb-2 color-D8DADCE5 fw-normal font-13'>Available Unit</label>
                        <h4>{basicDetails.available_unit}</h4>
                    </div>
                    <div>
                        <img src={Images.available_unit} height="60px" />
                    </div>
                </div>
            </div>
            <div className='col-md-3 ps-0'>
                <div className='PageHeader d-flex p-3 align-items-center justify-content-between'>
                    <div >
                        <label className='pb-2 color-D8DADCE5 fw-normal font-13'>Interested Leads</label>
                        <h4>{basicDetails.intersted_units}</h4>
                    </div>
                    <div>
                        <img src={Images.intersted_units} height="60px" />
                    </div>
                </div>
            </div>
            <div className='col-md-3 ps-0'>
                <div className='PageHeader d-flex p-3 align-items-center justify-content-between'>
                    <div >
                        <label className='pb-2 color-D8DADCE5 fw-normal font-13'>Booked Units (Allotted)</label>
                        <h4>{basicDetails.booked_units}</h4>
                    </div>
                    <div>
                        <img src={Images.booked_units} height="60px" />
                    </div>
                </div>
            </div>
            <div className='col-md-3 px-0'>
                <div className='PageHeader d-flex p-3 align-items-center justify-content-between'>
                    <div >
                        <label className='pb-2 color-D8DADCE5 fw-normal font-13'>Payment Pending</label>
                        <h4>{basicDetails.payment_pending}</h4>
                    </div>
                    <div>
                        <img src={Images.payment_pending} height="60px" />
                    </div>
                </div>
            </div>
        </div>
    )
}
