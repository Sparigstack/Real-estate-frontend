import React, { useEffect, useState } from 'react'
import Images from '../../utils/Images'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ShowLoader from '../../components/loader/ShowLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import PropertyCard from './PropertyCard';
import useApiService from '../../hooks/useApiService';
import useAuth from '../../hooks/useAuth';
import useProperty from '../../hooks/useProperty';

export default function YourProperties() {
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const { logout } = useAuth();
    const { getAPI } = useApiService();
    const userId = Cookies.get('userId');
    const { switchProperty } = useProperty();
    const [propertiesData, setpropertiesData] = useState([]);
    useEffect(() => {
        const GetUserProperties = async () => {
            try {
                const result = await getAPI(`/get-user-property-details/${userId}`, 3);
                if (!result) {
                    throw new Error('Something went wrong');
                }
                const responseRs = JSON.parse(result);
                setpropertiesData({
                    commercial: responseRs.commercial_properties,
                    residential: responseRs.residential_properties
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        GetUserProperties();
    }, [])
    const getCardClick = async (item) => {
        setloading(true);
        Cookies.set('propertyId', item.id, { expires: 1, secure: true, sameSite: 'Strict' });
        Cookies.set('propertyName', item.name, { expires: 1, secure: true, sameSite: 'Strict' });
        await switchProperty(item.id, item.name);
        setTimeout(() => {
            setloading(false);
            navigate("/dashboard");
        }, 2000);

    }
    const handleLogout = () => {
        setloading(true);
        setTimeout(() => {
            logout();
            setloading(false);
            navigate("/");
        }, 2000);
    };
    return (
        <div className="content-area h-100vh p-3">
            {loading && <ShowLoader />}
            <div className='row align-items-center '>
                <div className='col-md-9 fontwhite'>
                    <h3 className='mb-0'>Your Properties !</h3>
                </div>
                <div className='col-md-2 text-end pe-0'>
                    <button type='button' className='WhiteBtn w-100' onClick={() => navigate('/add-property', { state: { ShowBack: true } })}>
                        <img src={Images.blackaddicon} className='img-fluid pe-2' />Add Property
                    </button>
                </div>
                <div className='col-md-1'>
                    <div className='col-12 justify-content-center align-items-center fontwhite d-flex cursor-pointer' onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} className='logout-icon' />
                    </div>
                </div>
            </div>
            {propertiesData?.commercial?.length > 0 && (
                <div className='row my-4'>
                    <div className='col-11'>
                        <h5 className='fontwhite'>Commercial</h5>
                    </div>
                    {propertiesData?.commercial?.length > 4 && (
                        <div className='col-1 fontwhite cursor-pointer text-decoration-underline' onClick={() => navigate('/all-properties/1')}>
                            <b>See all</b>
                            <FontAwesomeIcon icon={faAngleRight} className='ps-2' />
                        </div>
                    )}

                    <div className="d-flex flex-wrap">
                        {propertiesData?.commercial.slice(0, Math.min(4, propertiesData?.commercial?.length)).map((item, index) => {
                            return <PropertyCard key={index} cardclick={(e) => getCardClick(item)} city={item?.city_name}
                                img={item.property_img || Images.dummy_property} name={item.name} area={item?.area} />
                        })}
                    </div>
                </div>
            )}
            {propertiesData?.residential?.length > 0 && (
                <div className='row my-4'>
                    <div className='col-11'>
                        <h5 className='fontwhite'>Residential</h5>
                    </div>
                    {propertiesData.residential.length > 4 && (
                        <div className='col-1 fontwhite cursor-pointer text-decoration-underline' onClick={() => navigate('/all-properties/2')}>
                            <b>See all</b>
                            <FontAwesomeIcon icon={faAngleRight} className='ps-2' />
                        </div>
                    )}
                    <div className="d-flex flex-wrap">
                        {propertiesData?.residential?.slice(0, 4).map((item, index) => {
                            return <PropertyCard key={index} cardclick={(e) => getCardClick(item)} city={item?.city_name}
                                img={item.property_img || Images.dummy_property} name={item.name} area={item?.area} />
                        })}
                    </div>
                </div>
            )}

        </div>
    )
}
