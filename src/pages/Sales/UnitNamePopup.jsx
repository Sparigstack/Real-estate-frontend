import React, { useState } from 'react'
import useProperty from '../../hooks/useProperty'
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import { isAlpha, isNumeric } from '../../utils/js/Common';

export default function UnitNamePopup({ setShowAlerts, setloading, FloorUnitDetails, closePopup }) {
    const { schemeId, refreshPropertyDetails } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [updatedUnitDetails, setUpdatedUnitDetails] = useState(
        FloorUnitDetails?.floor_details?.slice(0, 2).map(floor => ({
            floorId: floor.id,
            unit_details: floor?.unit_details?.slice(0, 3).map(unit => ({
                unitId: unit.id,
                name: unit.name,
            })),
        }))
    );
    const handleInputChange = (floorIndex, unitIndex, newName) => {
        setUpdatedUnitDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            const floorDetails = updatedDetails[floorIndex];
            if (isNumeric(newName)) {
                const firstUnitValue = parseInt(newName, 10);
                floorDetails.unit_details.forEach((unit, index) => {
                    if (index >= unitIndex) {
                        unit.name = (firstUnitValue + (index - unitIndex)).toString();
                    }
                });
            } else if (isAlpha(newName)) {
                const firstCharCode = newName.charCodeAt(0);
                floorDetails.unit_details.forEach((unit, index) => {
                    if (index >= unitIndex) {
                        unit.name = String.fromCharCode(firstCharCode + (index - unitIndex));
                    }
                });
            } else {
                floorDetails.unit_details.forEach((unit, index) => {
                    if (index == unitIndex) {
                        unit.name = '';
                    }
                });
            }

            return updatedDetails;
        });
    };
    const SaveUnitNames = async () => {
        var raw = JSON.stringify({
            propertyId: schemeId,
            wingId: FloorUnitDetails?.id,
            floordetails: updatedUnitDetails,
            flag: 1,
            unitDetails: null
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
                Our current terminology for unit names is as follows:
            </div>
            <div className='row pt-2 font-14'>
                {FloorUnitDetails?.floor_details?.slice(0, 2).map((item, index) => {
                    const actualUnits = item.unit_details.slice(0, 3);
                    return <div className='col-12 ' key={index}>
                        <label>Floor {index + 1} &nbsp; : &nbsp;</label>
                        {actualUnits?.map((units, unitindex) => {
                            return <label key={unitindex}>{units?.name}
                                {unitindex < actualUnits.length - 1 ? ", " : "..."}
                            </label>
                        })}
                    </div>
                })}
                <label className='pt-2'>and so on...</label>
            </div>
            <div className='fw-bold pt-3'>
                What type of terminology would you like to use for unit names?
            </div>
            <div className='row pt-2 font-14'>
                {updatedUnitDetails.slice(0, 2).map((floor, floorIndex) => (
                    <div className='row pb-2 align-items-center' key={floor.floorId}>
                        <div className='col-md-2 pe-0'>
                            Floor {floorIndex + 1}
                        </div>
                        {floor.unit_details.slice(0, 3).map((unit, unitIndex) => (
                            <div key={unit.unitId} className='col-md-3'>
                                <input
                                    type='text'
                                    className='form-control font-14'
                                    value={unit.name}
                                    onChange={e => handleInputChange(floorIndex, unitIndex, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className='col-md-1'>
                            <span className='me-2'>...</span>
                        </div>
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
