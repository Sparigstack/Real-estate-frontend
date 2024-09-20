import React, { createContext, useState } from 'react'
import ShowLoader from '../components/loader/ShowLoader';
import HideLoader from '../components/loader/HideLoader';
export const CommercialContext = createContext();
export default function CommercialProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [utils, setUtils] = useState({
        propertyFlag: 0,
        propertyId: null,
        wingId: null,
        floorUnitDetails: [],
        floorUnitCounts: [],
        propertyTypeDetails: [],
        commercialStepView: 0
    });
    const [commercialDetails, setCommercialDetails] = useState({
        propertyName: '',
        reraRegisteredNumber: '',
        propertySubTypeFlag: '',
        address: '',
        pincode: '',
        numberofWings: '',
        description: '',
    });
    const [wingDetails, setWingDetails] = useState({
        wingName: '',
        numberofFloors: '',
        numberofUnits: '',
    })
    const [unitDetails, setUnitDetails] = useState({
        unitSize: '',
        startingNumber: ''
    })
    return (
        <>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <CommercialContext.Provider value={{
                utils, setUtils, commercialDetails, wingDetails, setShowAlerts, setLoading, setWingDetails, unitDetails
            }}>
                {children}
            </CommercialContext.Provider>
        </>
    )
}
