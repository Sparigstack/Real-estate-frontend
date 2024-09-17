import React, { createContext, useState } from 'react'
import ShowLoader from '../components/loader/ShowLoader';
import HideLoader from '../components/loader/HideLoader';


export const CommercialContext = createContext();
export default function CommercialProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [propertyFlag, setPropertyFlag] = useState(0); //0->Add Property 1-> Commercial 2->Residential
    const [propertyId, setPropertyId] = useState(null);
    const [wingId, setWingId] = useState(null);
    const[floorUnitDetails, setFloorUnitDetails] = useState([]);
    const [commercialDetails, setCommercialDetails] = useState({
        propertyName: '',
        reraRegisteredNumber: '',
        propertySubTypeFlag:'',
        address: '',
        pincode: '',
        numberofWings: '',
        description: '',
    });
    const [propertyTypeDetails , setPropertyTypeDetails] = useState([]);
    const [commercialStepView, setCommercialStepView] = useState(0); //0 -> Commercial details form, 1 -> Add wings,
    const [wingDetails, setWingDetails] = useState({
        wingName:'',
        numberofFloors:'',
        numberofUnits:'',
    })
    const [unitDetails, setUnitDetails] = useState({
        unitSize:'',
        startingNumber:''
    })
    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <CommercialContext.Provider value={{commercialDetails, setCommercialDetails, propertyFlag, setPropertyFlag, propertyTypeDetails, setPropertyTypeDetails, propertyId, setPropertyId, commercialStepView, setCommercialStepView, wingDetails, setWingDetails, wingId, setWingId, floorUnitDetails, setFloorUnitDetails, unitDetails,setUnitDetails }}>
                {children}
            </CommercialContext.Provider>
        </>
    )
}
