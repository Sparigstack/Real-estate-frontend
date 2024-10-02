import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import useApiService from '../../services/ApiService';
import Images from '../../utils/Images';
import AddPropertyForm from './AddPropertyForm';
import { useNavigate } from 'react-router-dom';

export default function Properties() {
    const { getAPI } = useApiService();
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const [propertiesData, setpropertiesData] = useState([]);
    useEffect(() => {
        GetUserProperties();
    }, [])
    const GetUserProperties = async () => {
        try {
            const result = await getAPI(`/get-user-properties/${userId}`, 2);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setpropertiesData(responseRs)
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            {propertiesData.length == 0 ?
                <div className="content-area h-100vh">
                    <div className='text-center text-white pt-5'>
                        <div className="d-flex align-items-center justify-content-center position-relative">
                            <img src={Images.realEstateLogo} alt="realestatelogo" className='' />
                        </div>
                        <div className='loginContent'>
                            <div className="text-center p-4">
                                <h4 className='heading pt-4'>Add Property !</h4>
                                <p className='font-16 text-white fw-normal'>It will only take 5 minutes to add property details. <span className='fw-bold'>Let's Start</span></p>
                                <h5 className='pt-3 text-white fw-semibold'>Choose your Scheme type?</h5>
                                <div className='text-center d-flex justify-content-center gap-3 pt-3'>
                                    <div className='propertiesOptions cursor-pointer' onClick={(e) => navigate('/add-properties/1')}>
                                        <img src={Images.commercial} alt="commercial" style={{ height: '30px' }} />
                                        <br />
                                        Commercial
                                    </div>
                                    <div className='propertiesOptions cursor-pointer' onClick={(e) => navigate('/add-properties/2')}>
                                        <img src={Images.residential} alt="residential" style={{ height: '30px' }} />
                                        <br />
                                        Residential
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                :
                <h1>hello</h1>
            }
        </div>
    )
}
