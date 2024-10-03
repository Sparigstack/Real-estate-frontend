import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import useApiService from '../../services/ApiService';
import YourProperties from './YourProperties';
import AddPropertyIndex from './AddPropertyIndex';
import '../../styles/property.css'

export default function Properties() {
    const { getAPI } = useApiService();
    const userId = Cookies.get('userId');
    const [propertiesData, setpropertiesData] = useState({
        commercial: [],
        residential: []
    });
    useEffect(() => {
        GetUserProperties();
    }, [])
    const GetUserProperties = async () => {
        try {
            const result = await getAPI(`/get-user-property-details/${userId}`, 2);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setpropertiesData({
                ...propertiesData,
                commercial: responseRs.commercial_properties,
                residential: responseRs.residential_properties
            })
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div>
            {propertiesData?.commercial?.length == 0 && propertiesData?.residential?.length == 0 ?
                <AddPropertyIndex />
                : propertiesData?.commercial?.length > 0 || propertiesData?.residential?.length > 0 ?
                    <YourProperties propertiesData={propertiesData} />
                    :
                    <></>
            }
        </div>
    )
}
