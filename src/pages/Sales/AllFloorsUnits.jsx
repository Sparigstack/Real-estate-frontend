import React, { useEffect, useState } from 'react'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../utils/js/Common';
import DeleteModal from '../../utils/DeleteModal';
import Loader from '../../components/loader/Loader';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';

export default function AllFloorsUnits({ FloorUnitDetails, activeWingId, getAllWings, setFloorUnitDetails, bulkEditFlag, setbulkEditFlag }) {
    const { postAPIAuthKey } = useApiService();
    const [FloorDeleteModal, setFloorDeleteModal] = useState(false);
    const [unitDeleteModal, setUnitDeleteModal] = useState(false);
    const [ActionDetails, setActionDetails] = useState({
        floorid: "",
        actionId: "",
        unitId: null,
        unitSize: "",
        price: ""
    })
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);
    const [loading, setloading] = useState(false);
    const totalFloors = FloorUnitDetails?.floor_details?.length || 0;
    const itemsPerPage = 4;
    const maxLengthOfUnits = Math.max(...(FloorUnitDetails?.floor_details?.map(floor => floor.unit_details.length) || [0]));
    let progressPercentage = maxLengthOfUnits > 0 ? Math.min(((currentIndex + itemsPerPage) / maxLengthOfUnits) * 100, 100) : 0;
    useEffect(() => {
        setCurrentIndex(0)
    }, [activeWingId]);
    const handleNext = () => {
        if (currentIndex + itemsPerPage < maxLengthOfUnits) {
            setCurrentIndex(currentIndex + itemsPerPage);
            const scrollContainer = document.querySelector('.scroll-container-commercial');
            if (scrollContainer) {
                scrollContainer.scrollBy({ left: scrollContainer.offsetWidth, behavior: 'smooth' });
            }
        }
    };
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
            const scrollContainer = document.querySelector('.scroll-container-commercial');
            if (scrollContainer) {
                scrollContainer.scrollBy({ left: -scrollContainer.offsetWidth, behavior: 'smooth' });
            }
        }
    };

    const handleActions = async () => {
        setloading(true);
        var raw = JSON.stringify({
            actionId: ActionDetails.actionId,
            floorId: ActionDetails.floorid,
            unitId: ActionDetails.unitId,
            unitSize: ActionDetails.unitSize,
            price: ActionDetails.price
        })
        try {
            const result = await postAPIAuthKey('/update-wing-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    var msg = ActionDetails.actionId == 3 ? "Floor Deleted Successfully." :
                        ActionDetails.actionId == 2 ? "Unit Deleted Successfully." : "Unit Updated Successfully";
                    setShowAlerts(<AlertComp show={true} variant="success" message={msg} />);
                    setFloorDeleteModal(false);
                    setUnitDeleteModal(false);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        getAllWings();
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(<AlertComp show={false} />);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleSingleUnitEdit = (unitId, floorId, unitflag, newPrice, newSize) => {
        const updatedFloors = FloorUnitDetails.floor_details.map(floor => {
            const updatedUnits = floor.unit_details.map((unit, index) => {
                if (floorId === floor.id && unitId == unit.id) {
                    return {
                        ...unit,
                        flag: unitflag,
                        price: newPrice !== undefined ? newPrice : unit.price,
                        square_feet: newSize !== undefined ? newSize : unit.square_feet
                    };
                }
                return unit;
            });

            return {
                ...floor,
                unit_details: updatedUnits
            };
        });
        setFloorUnitDetails(prevDetails => ({
            ...prevDetails,
            floor_details: updatedFloors
        }));
        setActionDetails(prevdata => ({
            ...prevdata,
            unitSize: 0,
            price: 0,
            floorid: floorId,
            unitId: unitId,
            actionId: 1
        }));
    };

    const handleCancelBulkEdit = () => {
        setbulkEditFlag(0);
        const updatedFloors = FloorUnitDetails.floor_details.map(floor => {
            const updatedUnits = floor.unit_details.map(unit => ({
                ...unit,
                flag: 0
            }));
            return {
                ...floor,
                unit_details: updatedUnits
            };
        });

        setFloorUnitDetails(prevDetails => ({
            ...prevDetails,
            floor_details: updatedFloors
        }));
    };

    const handleInputChange = (floorId, unitId, field, value) => {
        const updatedFloors = FloorUnitDetails.floor_details.map(floor => {
            const updatedUnits = floor.unit_details.map(unit => {
                if (unit.id === unitId) {
                    return { ...unit, [field]: value };
                }
                return unit;
            });
            return { ...floor, unit_details: updatedUnits };
        });

        setFloorUnitDetails(prevDetails => ({
            ...prevDetails,
            floor_details: updatedFloors
        }));
        setActionDetails(prevdata => ({
            ...prevdata,
            [field === "square_feet" ? "unitSize" : "price"]: value,
            floorid: floorId,
            unitId: unitId,
            actionId: 1
        }));
    }

    const handleSaveBulkEdit = async () => {
        setloading(true);
        var floorwisearray = [];
        {
            FloorUnitDetails?.floor_details?.map((item) => {
                var vjson = {};
                var unitsarray = [];
                vjson['floorId'] = item.id;
                item.unit_details.map((unititem) => {
                    var unitjson = {};
                    unitjson['unitId'] = unititem.id;
                    unitjson['name'] = unititem.name;
                    unitjson['square_feet'] = unititem.square_feet || 0;
                    unitjson['price'] = unititem.price || 0;
                    unitsarray.push(unitjson);
                });
                vjson['unit_details'] = unitsarray;
                floorwisearray.push(vjson);
            })
        }
        var raw = JSON.stringify({
            wingId: activeWingId,
            wingDetails: floorwisearray
        })
        try {
            const result = await postAPIAuthKey('/bulk-updates-for-wings-details', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message={"Units Updated Successfully"} />);
                    setbulkEditFlag(0)
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        getAllWings();
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(<AlertComp show={false} />);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleAddUnit = async (floorid) => {
        setloading(true);
        var raw = JSON.stringify({
            floorId: floorid
        })
        try {
            const result = await postAPIAuthKey('/add-new-unit', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message={"Unit Added Successfully"} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(<AlertComp show={false} />);
                        getAllWings();
                    }, 2500);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(<AlertComp show={false} />);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='container px-4'>
                <div className='row'>
                    <div className='buildingimage pb-5 pt-4 px-3 h-100'>
                        {bulkEditFlag == 1 &&
                            <div className='col-12 text-center '>
                                <button className='greyCancelbtn me-2'
                                    onClick={handleCancelBulkEdit}>Close</button>
                                <button className='WhiteBtn' onClick={handleSaveBulkEdit}>Save Changes</button>
                            </div>
                        }
                        <div className='row align-items-center py-2'>
                            <div className='col-9 offset-md-1'>
                                <div className="progress" style={{ height: "10px" }}>
                                    <div className="progress-bar" role="progressbar" style={{ width: `${progressPercentage}%` }} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className='col-2 pe-5 d-flex justify-content-end'>
                                <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrev}
                                    className={`scroll-icon me-3 ${currentIndex > 0 ? 'activescrollicon' : 'disabledscrollicon'}`} />
                                <FontAwesomeIcon icon={faChevronRight} onClick={handleNext}
                                    className={`scroll-icon ${currentIndex + itemsPerPage < maxLengthOfUnits ? 'activescrollicon' : 'disabledscrollicon'}`} />
                            </div>
                        </div>
                        <div className="">
                            {FloorUnitDetails?.floor_details?.map((item, index) => {
                                const endUnit = item.unit_details.length - 1;
                                const floorNumber = totalFloors - index;
                                return <div className='row' key={index}>
                                    <div className='col-md-2 row align-items-center'>
                                        <div className='col-2'>
                                            <img src={Images.add_unit} className='cursor-pointer iconsize' title='Add Unit in this floor' onClick={(e) => handleAddUnit(item.id)} />
                                            <img src={Images.delete_icon} className='cursor-pointer iconsize'
                                                title='Delete floor' onClick={(e) => { setFloorDeleteModal(true); setActionDetails({ ...ActionDetails, floorid: item.id, actionId: 3 }) }} />
                                        </div>
                                        <div className='col-9 ps-4'>
                                            <div className='fw-bold'>Floor {floorNumber}</div>
                                            <div className='greyColor font-12'>({item.unit_details[0]?.name} to {item.unit_details[endUnit]?.name})</div>
                                        </div>
                                    </div>
                                    <div className="col-md-10 row p-0 pt-1">
                                        <div className="scroll-container scroll-container-commercial p-0">
                                            <div className="d-flex flex-wrap">
                                                {item.unit_details?.slice(currentIndex, currentIndex + itemsPerPage).map((units, unitindex) => {
                                                    return <div className='col-md-3' key={unitindex}>
                                                        <div className='units_box row p-2 m-2'>
                                                            <div className='col-md-10'>
                                                                <div className='font-14 '>{units.name}</div>
                                                                <div className='font-12 pt-2 greyColor'>Unit Size :
                                                                    {units?.flag == 1 ?
                                                                        <div className="input-group">
                                                                            <input type="number" min={0} className="form-control p-0 px-1 font-13" name='sqft' autoComplete='off'
                                                                                value={units.square_feet || 0} onChange={(e) => handleInputChange(item.id, units.id, 'square_feet', e.target.value)} />
                                                                            <span className="input-group-text p-1">
                                                                                <label className='font-12'>sqft</label>
                                                                            </span>
                                                                        </div>
                                                                        :
                                                                        <label className='ps-1'>{units.square_feet || 0} sqft</label>
                                                                    }
                                                                </div>
                                                                <div className='font-12 greyColor pt-2'>Unit Price :
                                                                    {units?.flag == 1 ?
                                                                        <div className="input-group">
                                                                            <input type="number" min={0} className="form-control p-0 px-1 font-13" name='price'
                                                                                autoComplete='off' value={units.price || 0} onChange={(e) => handleInputChange(item.id, units.id, 'price', e.target.value)} />
                                                                            <span className="input-group-text">
                                                                                <FontAwesomeIcon icon={faIndianRupeeSign} className='font-12' />
                                                                            </span>
                                                                        </div>
                                                                        :
                                                                        <label className='ps-1'>
                                                                            {formatCurrency(units.price || 0)}
                                                                            <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1' />
                                                                        </label>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='col-md-2 p-0'>
                                                                <img src={units?.flag == 1 ? Images.white_edit : Images.grey_edit} className={`cursor-pointer ${units?.flag == 1 ? 'active_units_box' : 'units_box'} bigiconsize p-1`}
                                                                    title="Edit Unit"
                                                                    onClick={() => handleSingleUnitEdit(units.id, item.id, 1, units.price, units.square_feet)} />
                                                                <img src={Images.grey_delete} className='cursor-pointer units_box bigiconsize p-1 my-1' title='Delete Unit'
                                                                    onClick={(e) => { setUnitDeleteModal(true); setActionDetails({ ...ActionDetails, unitId: units.id, actionId: 2, floorid: item.id }) }} />
                                                                <img src={Images.grey_info} className='cursor-pointer units_box bigiconsize p-1' title='View Info' />
                                                            </div>
                                                            {units?.flag == 1 && bulkEditFlag == 0 && (
                                                                <div className='col-12 d-flex pt-2 justify-content-end'>
                                                                    <button className='CancelBtn py-0 px-2 me-2' style={{ fontSize: "12px" }}
                                                                        onClick={(e) => handleSingleUnitEdit(units.id, item.id, 0)}>Close</button>
                                                                    <button className='SuccessBtn py-0 px-2' style={{ fontSize: "12px" }}
                                                                        onClick={handleActions}>Save</button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                        <div className='col-12 text-center pt-5'>
                            <button className='SuccessBtn'>{FloorUnitDetails.name} Wing</button>
                        </div>
                    </div>
                    <div className='col-md-3 buildingbase mb-5' ></div>
                    <div className='col-md-6' style={{ borderTop: "8px solid #303260" }}></div>
                    <div className='col-md-3 buildingbase mb-5'></div>
                </div>
            </div>

            {FloorDeleteModal &&
                <DeleteModal isShow={FloorDeleteModal} title={"Are you sure want to delete this Floor?"} handleSuccess={handleActions}
                    successtext={"Yes, Delete It!"} canceltext={"No, Keep It."}
                    Cancel={(e) => { setFloorDeleteModal(false); setActionDetails({ ...ActionDetails, floorid: "", actionId: "" }) }} />
            }
            {unitDeleteModal &&
                <DeleteModal isShow={unitDeleteModal} title={"Are you sure want to delete this Unit?"} handleSuccess={handleActions}
                    successtext={"Yes, Delete It!"} canceltext={"No, Keep It."}
                    Cancel={(e) => { setUnitDeleteModal(false); setActionDetails({ ...ActionDetails, floorid: "", actionId: "", unitId: "" }) }} />
            }
        </>
    )
}
