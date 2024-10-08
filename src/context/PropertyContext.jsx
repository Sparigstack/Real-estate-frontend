import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const PropertyContext = createContext({});

export const PropertyProvider = ({ children }) => {
    const [propertyId, setPropertyId] = useState(Cookies.get('propertyId') || null);
    const [propertyName, setPropertyName] = useState(Cookies.get('propertyName') || null);
    const navigate = useNavigate();
    useEffect(() => {
        if (propertyId) {
            Cookies.set('propertyId', propertyId, { expires: 1, secure: true, sameSite: 'Strict' });
            Cookies.set('propertyName', propertyName, { expires: 1, secure: true, sameSite: 'Strict' });
        } else {
            Cookies.remove('propertyId');
            Cookies.remove('propertyName');
        }
    }, [propertyId]);

    const switchProperty = (id, name) => {
        setPropertyId(id);
        setPropertyName(name);
    };
    const handleSwitchProperty = () => {
        setPropertyId(null);
        setPropertyName(null);
        Cookies.remove('propertyId');
        Cookies.remove('propertyName');
        navigate('/properties');
    };
    return (
        <PropertyContext.Provider value={{ propertyId, switchProperty, handleSwitchProperty }}>
            {children}
        </PropertyContext.Provider>
    );
};

export default PropertyContext;

