import React, { useEffect, useState } from 'react'
import Images from '../../utils/Images'
import Loader from '../../components/loader/Loader';
import useApiService from '../../hooks/useApiService';
import { useNavigate } from 'react-router-dom';

export default function AllModulesPricing() {
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState([]);
    const { getAPIAuthKey } = useApiService();
    const navigate = useNavigate();
    useEffect(() => {
        const getModules = async () => {
            setLoading(true);
            try {
                const result = await getAPIAuthKey(`/get-module-with-price`);
                if (!result || result == "") {
                    alert('Something went wrong');
                }
                else {
                    setLoading(false);
                    const responseRs = JSON.parse(result);
                    setModules(responseRs)
                }
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        getModules();
    }, []);
    return (
        <>
            {loading && <Loader runningcheck={loading} />}
            <div className='fontwhite px-5'>
                <div className='col-12 text-center pt-4'>
                    <h3>Choose the perfect module for your team.</h3>
                    <small className='color-D8DADCE5'>
                        Our pricing plans are designed to be affordable, flexible, and customized to meet your unique needs.
                    </small>
                </div>
                <div className='row justify-content-center pt-4'>
                    {modules.length > 0 &&
                        modules.map((item, index) => {
                            return <div className='col-4 my-2 ' key={index}>
                                <div className='module_boxes'>
                                    <div className='col-12'>
                                        <img src={Images.video_frame} className='w-100' />
                                    </div>
                                    <div className='col-12 pt-3 font-16 text-center fw-semibold'>
                                        {item.module_name}
                                    </div>
                                    <div className='col-12 pt-1 text-center color-D8DADCE5 fw-medium'>
                                        Pricing Start at ₹{item.starting_price}/ month
                                    </div>
                                    <div className='col-12 text-center pt-4 pb-3'>
                                        <button className='WhiteBtn w-75' type='button' onClick={(e) =>
                                            navigate('/plan-pricing',
                                                { state: { moduleid: item.id, previousPath: location.pathname, } })}>
                                            Select Plan</button>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}
