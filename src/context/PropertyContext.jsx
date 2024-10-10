import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import useApiService from '../hooks/useApiService';

const PropertyContext = createContext({});

export const PropertyProvider = ({ children }) => {
    const [propertyId, setPropertyId] = useState(Cookies.get('propertyId') || null);
    const [propertyDetails, setpropertyDetails] = useState({});
    const navigate = useNavigate();
    const { getAPIAuthKey } = useApiService();
    useEffect(() => {
        if (propertyId) {
            Cookies.set('propertyId', propertyId, { expires: 1, secure: true, sameSite: 'Strict' });
            getPropertyDetails();
        } else {
            Cookies.remove('propertyId');
        }
    }, [propertyId]);

    const getPropertyDetails = async () => {
        try {
            const result = await getAPIAuthKey(`/get-property-details/${propertyId}`);
            if (!result) throw new Error('Something went wrong');
            const response = JSON.parse(result);
            setpropertyDetails(response);
        } catch (error) {
            console.error(error);
        }
    };

    const switchProperty = (id, name) => {
        setPropertyId(id);
    };
    const handleSwitchProperty = () => {
        setPropertyId(null);
        Cookies.remove('propertyId');
        navigate('/properties');
    };
    return (
        <PropertyContext.Provider value={{ propertyId, switchProperty, handleSwitchProperty, propertyDetails }}>
            {children}
        </PropertyContext.Provider>
    );
};

export default PropertyContext;

