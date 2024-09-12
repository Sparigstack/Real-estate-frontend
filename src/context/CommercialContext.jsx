import React, { createContext, useEffect, useState } from 'react'
import ShowLoader from '../components/loader/ShowLoader';
import HideLoader from '../components/loader/HideLoader';


export const CommercialContext = createContext();
export default function CommercialProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [propertyFlag, setPropertyFlag] = useState(0);
    const [commercialDetails, setCommercialDetails] = useState({
        propertyName: '',
        reraRegisteredNumber: '',
        propertySubTypeFlag:'',
        address: '',
        pincode: '',
        numberofWings: '',
        description: '',
        minPrice:'',
        maxPrice:'',
        propertyPlan:''
    });
    const [propertyTypeDetails , setPropertyTypeDetails] = useState([]);
    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <CommercialContext.Provider value={{commercialDetails, setCommercialDetails, propertyFlag, setPropertyFlag, propertyTypeDetails, setPropertyTypeDetails  }}>
                {children}
            </CommercialContext.Provider>
        </>
    )
}
