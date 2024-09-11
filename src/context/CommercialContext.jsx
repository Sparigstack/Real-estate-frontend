import React, { createContext, useState } from 'react'
import ShowLoader from '../components/loader/ShowLoader';
import HideLoader from '../components/loader/HideLoader';

export const CommercialContext = createContext();
export default function CommercialProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [commerCialDetails, setCommercialDetails] = useState({
        propertyName: '',
        reraRegisteredNumber: '',
        address: '',
        pincode: '',
        numberofWings: '',
        description: ''
    });
    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <CommercialContext.Provider value={{commerCialDetails, setCommercialDetails }}>
                {children}
            </CommercialContext.Provider>
        </>
    )
}
