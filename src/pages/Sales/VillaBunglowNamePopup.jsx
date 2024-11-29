import React, { useState } from 'react'
import useProperty from '../../hooks/useProperty'
import { isAlpha, isNumeric } from '../../utils/js/Common';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';

export default function VillaBunglowNamePopup({ setShowAlerts, setloading, unitDetails, closePopup }) {
    const { propertyDetails, schemeId, refreshPropertyDetails } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [updatedUnitDetails, setUpdatedUnitDetails] = useState({
        unitData: unitDetails?.slice(0, 3).map((unit) => ({ ...unit })),
    });
    const handleInputChange = (index, value) => {
        const updatedUnits = [...updatedUnitDetails.unitData];
        updatedUnits[index].name = value;
        if (isNumeric(value)) {
            for (let i = index + 1; i < updatedUnits.length; i++) {
                updatedUnits[i].name = (parseInt(updatedUnits[i - 1].name) + 1).toString();
            }
        } else if (isAlpha(value)) {
            for (let i = index + 1; i < updatedUnits.length; i++) {
                updatedUnits[i].name = String.fromCharCode(updatedUnits[i - 1].name.charCodeAt(0) + 1);
            }
        }

        setUpdatedUnitDetails({ unitData: updatedUnits });
    };
    const SaveUnitNames = async () => {
        var unitArray = [];
        {
            updatedUnitDetails?.unitData?.map((item, index) => {
                var vjson = {};
                vjson['unitId'] = item.id;
                vjson['name'] = item.name;
                unitArray.push(vjson);
            })
        }
        var raw = JSON.stringify({
            propertyId: schemeId,
            unitDetails: unitArray,
            wingId: null,
            floordetails: [],
            flag: 2
        })
        try {
            const result = await postAPIAuthKey('/update-unit-series-numbers', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message={"Unit Names Updated Successfully"} />);
                    closePopup()
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                        refreshPropertyDetails();
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);

                    }, 2000);
                    setTimeout(() => {
                        setShowAlerts(false);
                    }, 10000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='formLabel'>
            <div className='fw-bold '>
                Our current terminology for {propertyDetails?.property_name} names is as follows:
            </div>
            <div className=' pt-2 font-14 d-flex'>
                {unitDetails?.slice(0, 3).map((item, index) => {
                    return <label key={index}>{item?.name}
                        {index < unitDetails.slice(0, 3).length - 1 ? ", " : '...'}
                    </label>
                })}
            </div>
            <label className='pt-2'>and so on...</label>
            <div className='fw-bold pt-3'>
                What type of terminology would you like to use for {propertyDetails?.property_name} names?
            </div>
            <div className='row pt-2 font-14'>
                {updatedUnitDetails?.unitData?.slice(0, 3).map((unit, index) => (
                    <div className='col-md-3 pe-0' key={index}>
                        <input
                            type='text'
                            className='form-control font-14'
                            value={unit.name}
                            onChange={e => handleInputChange(index, e.target.value)} // Update name on input change
                        />
                    </div>
                ))}
                <label>and so on...</label>
            </div>
            <div className='col-md-12 my-3 text-center'>
                <button type="button" className='CancelBtn me-2' onClick={closePopup}>Cancel</button>
                <button type="submit" className='SuccessBtn' onClick={SaveUnitNames}>Save</button>
            </div>
        </div>
    )
}
