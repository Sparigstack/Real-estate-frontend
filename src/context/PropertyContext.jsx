import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import useApiService from '../hooks/useApiService';

const PropertyContext = createContext({});

export const PropertyProvider = ({ children }) => {
    const [schemeId, setSchemeId] = useState(Cookies.get('schemeId') || null);
    const [propertyDetails, setpropertyDetails] = useState({});
    const navigate = useNavigate();
    const { getAPIAuthKey } = useApiService();
    useEffect(() => {
        if (schemeId) {
            Cookies.set('schemeId', schemeId, { expires: 1 });
            getPropertyDetails();
        } else {
            Cookies.remove('schemeId');
            setSchemeId(null);
        }
    }, [schemeId]);


    const getPropertyDetails = async () => {
        try {
            const result = await getAPIAuthKey(`/get-property-details/${schemeId}`);
            if (!result) throw new Error('Something went wrong');
            const response = JSON.parse(result);
            setpropertyDetails(response);
        } catch (error) {
            console.error(error);
        }
    };

    const refreshPropertyDetails = () => {
        if (schemeId) {
            getPropertyDetails();
        }
    };

    const switchProperty = (id, name) => {
        setSchemeId(id);
    };
    const handleSwitchProperty = () => {
        setSchemeId(null);
        Cookies.remove('schemeId');
        navigate('/schemes');
    };

    return (
        <PropertyContext.Provider value={{ schemeId, switchProperty, handleSwitchProperty, propertyDetails, refreshPropertyDetails }}>
            {children}
        </PropertyContext.Provider>
    );
};

export default PropertyContext;

