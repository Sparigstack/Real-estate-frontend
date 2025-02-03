import React, { useEffect, useState } from 'react'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../utils/js/Common';
import Loader from '../../components/loader/Loader';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import CustomModal from '../../utils/CustomModal';
import BookingPopup from './BookingPopup';
import InterstedLeadsPopup from './InterstedLeadsPopup';
import ViewBookingPopup from './ViewBookingPopup';
import ScanChequePopup from './ScanCheque/ScanChequePopup';
import UnitNamePopup from './UnitNamePopup';
import useProperty from '../../hooks/useProperty';
import Cookies from 'js-cookie';
import UpgradePlanPopup from '../../components/UpgradePlan/UpgradePlanPopup';

export default function AllFloorsUnits({ FloorUnitDetails, activeWingId, setFloorUnitDetails, setShowAddFloordiv, nextWingId, setActiveWingId, getFloorsUnits }) {
    const [bulkEditFlag, setbulkEditFlag] = useState(0);
    const userid = Cookies.get('userId');
    const { refreshPropertyDetails, schemeId } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [scanChequeModal, setScanChequeModal] = useState(false);
    const [unitId, setUnitId] = useState(null);
    const [ActionDetails, setActionDetails] = useState({
        unitId: null,
        unitSize: "",
        price: ""
    })
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAlerts, setShowAlerts] = useState(false);
    const [loading, setloading] = useState(false);
    const [BookingModel, setBookingModel] = useState(false);
    const [editColumnIndex, setEditColumnIndex] = useState(null);
    const [InterstedLeadPopup, setInterstedLeadPopup] = useState(false);
    const [ViewBookingModal, setViewBookingModal] = useState(false);
    const [showLoader, setshowLoader] = useState(false);
    const [UnitNamePopupShow, setUnitNamePopupShow] = useState(false)
    const [BookingDetails, setBookingDetails] = useState({
        bookingtype: '',
        userid: ''
    })
    const [PlanPopup, setPlanPopup] = useState(false);
    const [planResponse, setPlanResponse] = useState({
        moduleid: "",
        planname: "",
        previousPath: location.pathname,
        buttontext: ""
    })
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
        setshowLoader(true);
        var raw = JSON.stringify({
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
                    setShowAlerts(<AlertComp show={true} variant="success" message={"Unit Updated Successfully"} />);
                    setbulkEditFlag(0)
                    setTimeout(() => {
                        setShowAlerts(false);
                        refreshPropertyDetails();
                        setshowLoader(false);
                    }, 2000);
                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setshowLoader(false);
                        setShowAlerts(false);
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
            unitId: unitId
        }));
    };

    const handleInputChange = (unitId, sqft, price) => {
        var firstfloor = FloorUnitDetails.floor_details[0];
        const updatedFloors = FloorUnitDetails.floor_details.map((floor) => {
            const updatedUnits = floor.unit_details.map((unit, index) => {
                if (bulkEditFlag == 1) {
                    if (unitId === firstfloor.unit_details[0].id || unit.id === unitId) {
                        return { ...unit, 'square_feet': sqft, 'price': price };
                    }
                } else if (editColumnIndex != null) {
                    if (index === editColumnIndex) {
                        return { ...unit, square_feet: sqft, price: price };
                    }
                }

                if (unit.id === unitId) {
                    return { ...unit, square_feet: sqft, price: price };
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
            unitSize: sqft,
            price: price,
            unitId: unitId,
        }));
    }

    const handleSaveBulkEdit = async () => {
        setloading(true);
        var floorwisearray = [];
        {
            editColumnIndex ?
                FloorUnitDetails?.floor_details?.map((item) => {
                    var vjson = {};
                    var unitsarray = [];
                    var unitjson = {};
                    if (item.unit_details[editColumnIndex]) {
                        unitjson['unitId'] = item.unit_details[editColumnIndex].id;
                        unitjson['name'] = item.unit_details[editColumnIndex].name;
                        unitjson['square_feet'] = item.unit_details[editColumnIndex].square_feet || 0;
                        unitjson['price'] = item.unit_details[editColumnIndex].price || 0;
                        unitsarray.push(unitjson);
                    }
                    vjson['floorId'] = item.id;
                    vjson['unit_details'] = unitsarray;
                    floorwisearray.push(vjson);
                })
                :
                FloorUnitDetails?.floor_details?.map((item) => {
                    var vjson = {};
                    var unitsarray = [];
                    item.unit_details.map((unititem) => {
                        var unitjson = {};
                        unitjson['unitId'] = unititem.id;
                        unitjson['name'] = unititem.name;
                        unitjson['square_feet'] = unititem.square_feet || 0;
                        unitjson['price'] = unititem.price || 0;
                        unitsarray.push(unitjson);
                    });
                    vjson['floorId'] = item.id;
                    vjson['unit_details'] = unitsarray;
                    floorwisearray.push(vjson);
                })
        }
        var raw = JSON.stringify({
            wingDetails: floorwisearray,
            flagforvilla: 0,
            propertyId: schemeId,
            unitDetails: null
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
                    setEditColumnIndex(null)
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
                        setShowAlerts(false);
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
            floorId: floorid,
            userId: userid,
            userCapabilities: "schemes_units_config"
        })
        try {
            const result = await postAPIAuthKey('/add-new-unit', raw);
            if (!result || result == "") {
                alert('Something went wrong');
            } else {
                const responseRs = JSON.parse(result);
                if (responseRs.status == 'success') {
                    setShowAlerts(<AlertComp show={true} variant="success" message={"Unit Added Successfully"} />);
                    setbulkEditFlag(0)
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                        refreshPropertyDetails();
                    }, 2500);
                } else if (responseRs.status == "upgradeplan") {
                    setloading(false);
                    setPlanResponse({
                        ...planResponse, moduleid: responseRs.moduleid, planname: responseRs.activeplanname,
                        buttontext: responseRs.buttontext
                    });
                    setPlanPopup(true);

                }
                else {
                    setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs?.message} />);
                    setTimeout(() => {
                        setloading(false);
                        setShowAlerts(false);
                    }, 2000);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleBulkEdit = () => {
        setbulkEditFlag(1);
        const updatedFloors = FloorUnitDetails.floor_details.map(floor => {
            const updatedUnits = floor.unit_details.map(unit => ({
                ...unit,
                flag: 1
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
        refreshPropertyDetails();
    };

    const handleBulkEditForColumn = (columnIndex) => {
        setEditColumnIndex(columnIndex); // Set the column index you are editing
    };

    const flaggedUnits = FloorUnitDetails?.floor_details?.some(item =>
        item.unit_details.some(unit => unit.flag === 1)
    );
    const maxFloorIndex = FloorUnitDetails?.floor_details?.reduce((maxIndex, floor, index, array) => {
        return (floor.unit_details.length > array[maxIndex].unit_details.length) ? index : maxIndex;
    }, 0);

    return (
        <>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='container mt-4 px-4'>
                <div className='row'>
                    <div className='buildingimage pt-2 pb-4 px-3 h-100'>
                        <div className='row'>
                            <div className='col-md-7 d-flex  fw-normal align-items-center font-12'>
                                <div className='d-flex align-items-center pe-3'>
                                    <div className="sales-legends me-1" style={{ background: "white" }}></div>
                                    <label>Available</label>
                                </div>
                                <div className='d-flex align-items-center pe-3'>
                                    <div className="sales-legends me-1" style={{ background: "#0055FF" }}></div>
                                    <label>Interested Leads</label>
                                </div>
                                <div className='d-flex align-items-center pe-3'>
                                    <div className="sales-legends me-1" style={{ background: "#08A95C" }}></div>
                                    <label>Booked(Allocated)</label>
                                </div>
                                <div className='d-flex align-items-center pe-3'>
                                    <div className="sales-legends me-1" style={{ background: "#FF8C01" }}></div>
                                    <label>Booked(Payment in Progress)</label>
                                </div>


                            </div>
                            <div className='col-md-5'>
                                <div className='d-flex justify-content-end font-13'>
                                    {/* {scanChequeModal == true ?
                                        <label style={{ color: "#03053D", borderBottom: "2px solid #03053D" }} className='d-flex cursor-pointer align-items-center' title='Scan Cheque'>
                                            <img src={Images.scan_cheque} className='pe-2 iconsize h-100' />
                                            Scan Cheque
                                        </label>
                                        :
                                        <div className='d-flex cursor-pointer align-items-center ' title='Scan Cheque' onClick={(e) => setScanChequeModal(true)}>
                                            <img src={Images.scan_cheque} className='pe-2 iconsize h-100' />
                                            <label className='cursor-pointer' style={{ color: "#03053D" }}>Scan Cheque</label>
                                        </div>
                                    } */}
                                    <div className='d-flex cursor-pointer align-items-center' title='Add Floors'
                                        onClick={(e) => setShowAddFloordiv(true)}>
                                        <img src={Images.blackaddicon} className='pe-2 w-25 h-100' />
                                        <label className='cursor-pointer' style={{ color: "#03053D" }}>Add Floors</label>
                                    </div>

                                </div>
                            </div>
                            {nextWingId && (
                                <div className='col-12 pt-2 text-end text-decoration-underline cursor-pointer'
                                    onClick={(e) => { setActiveWingId(nextWingId); getFloorsUnits(nextWingId) }}>
                                    Go to next Wing
                                </div>
                            )}
                        </div>
                        <div className='col-12 text-center pt-3 wing_name'>{FloorUnitDetails.name} Wing </div>

                        <div className='row align-items-center pt-3 pb-2'>
                            <div className='col-md-2'>
                                <label className='cursor-pointer font-13 fw-bold text-decoration-underline'
                                    title='Edit Unit Names' style={{ color: "#03053D" }} onClick={(e) => setUnitNamePopupShow(true)}>
                                    Edit Unit Names
                                </label>
                            </div>
                            <div className='col-md-8'>
                                <div className="progress" style={{ height: "7px" }}>
                                    <div className="progress-bar" role="progressbar" style={{ width: `${progressPercentage}%` }} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className='col-1 d-flex justify-content-end'>
                                <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrev}
                                    className={`scroll-icon me-3 ${currentIndex > 0 ? 'activescrollicon' : 'disabledscrollicon'}`} />
                                <FontAwesomeIcon icon={faChevronRight} onClick={handleNext}
                                    className={`scroll-icon ${currentIndex + itemsPerPage < maxLengthOfUnits ? 'activescrollicon' : 'disabledscrollicon'}`} />
                            </div>
                        </div>
                        <div className="position-relative">
                            {FloorUnitDetails?.floor_details?.map((item, index) => {
                                return index == 0 && (
                                    <div className='row py-2' key={index}>
                                        <div className='col-md-3 pe-0 row align-items-center'>
                                            {bulkEditFlag == 1 ?
                                                <div className='d-flex justify-content-start text-center font-13 align-items-center'>
                                                    <label className='cursor-pointer fw-bold me-2'
                                                        onClick={handleCancelBulkEdit}>Cancel</label>
                                                    <label className='cursor-pointer SuccessBtn p-1'
                                                        style={{ fontSize: "12px" }} onClick={handleSaveBulkEdit}>
                                                        Save Changes
                                                    </label>
                                                </div>
                                                :
                                                editColumnIndex != null || flaggedUnits ?
                                                    <label className='cursor-nodrop d-flex align-items-center ps-2' style={{ color: "#03053D" }}>
                                                        <img src={Images.bulk_edit} className='me-1 iconsize' />
                                                        <label className='fw-bold ps-1 cursor-nodrop'>Edit All</label>
                                                    </label> :
                                                    <label className='cursor-pointer ps-2 d-flex align-items-center' title='Edit All Units' style={{ color: "#03053D" }} onClick={handleBulkEdit}>
                                                        <img src={Images.bulk_edit} className='me-1 iconsize ' />
                                                        <label className='fw-bold ps-1 cursor-pointer'>Edit All</label>
                                                    </label>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                            {FloorUnitDetails?.floor_details?.map((item, index) => {
                                const endUnit = item.unit_details.length - 1;
                                const floorNumber = index + 1;
                                const actualUnits = item.unit_details.slice(currentIndex, currentIndex + itemsPerPage);
                                const dummyBoxCount = itemsPerPage - actualUnits.length;
                                let globalIndex = currentIndex;
                                return <div className='row py-2' key={index}>
                                    <div className='col-md-2 pe-0 row align-items-center'>
                                        <div className='col-2'>
                                            <img src={Images.add_unit} className='cursor-pointer iconsize' title='Add Unit in this floor' onClick={(e) => handleAddUnit(item.id)} />
                                        </div>
                                        <div className='col-9 ps-3'>
                                            <div className='fw-bold'>Floor {floorNumber}</div>
                                            <div className='greyColor font-12'>({item.unit_details[0]?.name} to {item.unit_details[endUnit]?.name})</div>
                                        </div>
                                    </div>
                                    <div className="col-md-10 row p-0 pt-1">
                                        <div className="scroll-container scroll-container-commercial p-0">
                                            <div className="d-flex flex-wrap">
                                                {actualUnits.map((units, unitindex) => {
                                                    const currentUnitIndex = globalIndex++;
                                                    var statusboxes = '';
                                                    var statuscolor = '';
                                                    if (units.booking_status == 2) {
                                                        statusboxes = 'blue_box'; //intersted leads
                                                        statuscolor = 'blue_text';
                                                    } else if (units.booking_status == 3) {
                                                        statusboxes = 'green_box'; //booked(allocated)
                                                        statuscolor = 'green_text';
                                                    } else if (units.booking_status == 4) {
                                                        statusboxes = 'orange_box'; //booked(payment in progress)
                                                        statuscolor = 'orange_text';
                                                    }
                                                    const isEditable = currentUnitIndex == editColumnIndex;
                                                    var paymentStatusPercentage = 0;
                                                    if (units.price > 0) {
                                                        paymentStatusPercentage = Math.round((units.total_paid_amount / units.price) * 100);
                                                    }
                                                    return <div className='col-md-3' key={unitindex}>
                                                        {index == maxFloorIndex && (
                                                            <div className='font-13'>
                                                                {bulkEditFlag == 1 || flaggedUnits ? (
                                                                    <div className='cursor-nodrop greyColor commoneditclass'>
                                                                        <img src={Images.grey_edit} className='iconsize pe-2' />
                                                                        <label className='cursor-nodrop'>Edit this Column</label>
                                                                    </div>
                                                                ) : isEditable ? (
                                                                    <div className='d-flex justify-content-center text-center commoneditclass align-items-center'>
                                                                        <label className='cursor-pointer fw-bold me-2'
                                                                            onClick={() => { handleBulkEditForColumn(null); refreshPropertyDetails(); }}>Cancel</label>
                                                                        <label className='cursor-pointer SuccessBtn p-1' style={{ fontSize: "12px" }} onClick={handleSaveBulkEdit}>Save Changes</label>
                                                                    </div>
                                                                ) : (
                                                                    <div className='cursor-pointer commoneditclass' title='Edit this column Units' onClick={() => handleBulkEditForColumn(currentUnitIndex)}>
                                                                        <img src={Images.grey_edit} className='iconsize pe-2' />
                                                                        <label className='cursor-pointer formLabel'>Edit this Column</label>
                                                                    </div>
                                                                )
                                                                }
                                                            </div>
                                                        )}
                                                        <div className={`units_box row p-1 mx-2 ${statusboxes}`} style={{ height: "100%" }}>
                                                            <div className='col-md-10'>
                                                                <div className={`font-14 ${statuscolor}`}>{units.name}</div>
                                                                <div className='font-12 pt-2 greyColor'>Unit Size :
                                                                    {units?.flag == 1 || isEditable ?
                                                                        <div className="input-group">
                                                                            <input type="number" min={0} className="form-control p-0 px-1 font-13" name='sqft' autoComplete='off'
                                                                                value={units.square_feet} onChange={(e) => handleInputChange(units.id, e.target.value, units.price)} />
                                                                            <span className="input-group-text p-1">
                                                                                <label className='font-12'>sqft</label>
                                                                            </span>
                                                                        </div>
                                                                        :
                                                                        <label className='ps-1'>{units.square_feet || 0} sqft</label>
                                                                    }
                                                                </div>
                                                                <div className='font-12 pt-2 greyColor'>Unit Price :
                                                                    {units?.flag == 1 || isEditable ?
                                                                        <div className="input-group">
                                                                            <input type="number" min={0} className="form-control p-0 px-1 font-13" name='price'
                                                                                autoComplete='off' value={units.price} onChange={(e) => handleInputChange(units.id, units.square_feet, e.target.value)} />
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
                                                                <div className='font-12 pt-2 greyColor'>Received :
                                                                    <label className='ps-1'>
                                                                        {formatCurrency(units.total_paid_amount || 0)}
                                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1' />
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className='col-md-2 p-0'>
                                                                {bulkEditFlag == 1 || editColumnIndex != null ?
                                                                    <img src={Images.grey_edit}
                                                                        className={`cursor-nodrop units_box bigiconsize p-1`} title="Edit Unit" />
                                                                    :
                                                                    <img src={units?.flag == 1 ? Images.white_edit : Images.grey_edit}
                                                                        className={`cursor-pointer ${units?.flag == 1 ? 'active_units_box' : 'units_box'} bigiconsize p-1`} title="Edit Unit"
                                                                        onClick={() => { handleSingleUnitEdit(units.id, item.id, 1, units.price, units.square_feet); setbulkEditFlag(0) }} />

                                                                }


                                                                {units.booking_status != 3 && units.booking_status != 4 && (
                                                                    <img src={BookingModel == true && unitId == units.id ? Images.booking_white : Images.booking}
                                                                        className={`cursor-pointer ${BookingModel == true && unitId == units.id ? 'active_units_box' : 'units_box'} bigiconsize p-1`}
                                                                        title='Add Booking Details'
                                                                        onClick={(e) => { setBookingModel(true); setUnitId(units.id) }} />
                                                                )}

                                                                {units.booking_status != 3 && units.booking_status != 4 && (
                                                                    <img src={InterstedLeadPopup == true && unitId == units.id ? Images.white_lead : Images.lead}
                                                                        className={`cursor-pointer ${InterstedLeadPopup == true && unitId == units.id ? 'active_units_box' : 'units_box'} bigiconsize p-1`} title='Add Leads'
                                                                        onClick={(e) => { setInterstedLeadPopup(true); setUnitId(units.id) }} />
                                                                )}
                                                            </div>

                                                            {units.price > 0 && units.booking_status == 4 && (
                                                                <div className='col-12 pt-2 unitsDiv'>
                                                                    <div className="progress" style={{ height: "9px" }}>
                                                                        <div className="progress-bar" role="progressbar" style={{ width: `${paymentStatusPercentage}%` }} aria-valuemin="0" aria-valuemax="100">
                                                                            <label className='fontwhite' style={{ fontSize: "8px" }}>{paymentStatusPercentage.toFixed(0)}%</label>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ fontSize: "9px" }} className='text-center pt-1'>
                                                                        {paymentStatusPercentage.toFixed(0)}% Payment Completed</div>
                                                                </div>
                                                            )}
                                                            {units.booking_status == 4 || units.booking_status == 3 ? (
                                                                units?.allocated_entities?.length > 0 && (
                                                                    units?.allocated_entities?.map((item, index) => {
                                                                        return <div className='col-12' key={index}>
                                                                            <div className='col-12 d-flex align-items-center pt-1'>
                                                                                {units.booking_status == 4 && (
                                                                                    <img src={Images.whatsapp} className='me-1 iconsize cursor-pointer' title='Send Reminder' />
                                                                                )}
                                                                                <b className={`${units.booking_status == 4 ? 'orange_text' : 'green_text'} font-14 text-decoration-underline cursor-pointer`} title='View Booking Details'
                                                                                    onClick={(e) => { setViewBookingModal(true); setUnitId(units.id); setBookingDetails({ ...BookingDetails, bookingtype: item.allocated_lead_id ? 1 : 2, userid: item.allocated_lead_id ? item.allocated_lead_id : item.allocated_customer_id }) }}>
                                                                                    {item.allocated_name}
                                                                                </b>
                                                                            </div>
                                                                        </div>
                                                                    })
                                                                )

                                                            ) : null}
                                                            {units.booking_status == 2 && (
                                                                <div className='col-12 d-flex align-items-center pt-1 cursor-pointer' onClick={(e) => { setInterstedLeadPopup(true); setUnitId(units.id) }}>
                                                                    <img src={Images.blue_lead} className='iconsize pe-1' />
                                                                    <b className={`blue_text font-14`} style={{ borderBottom: "2px solid #0055FF" }}>{units?.interested_lead_count} Leads</b>
                                                                </div>
                                                            )}

                                                            {units?.flag == 1 && bulkEditFlag == 0 && (
                                                                <div className='col-12 d-flex pt-2 justify-content-end pe-0'>
                                                                    <button className='CancelBtn py-0 px-2 me-2' style={{ fontSize: "12px" }}
                                                                        onClick={(e) => { handleSingleUnitEdit(units.id, item.id, 0); refreshPropertyDetails(false); }}>Cancel</button>
                                                                    <button className='SuccessBtn py-0 px-2' style={{ fontSize: "12px" }}
                                                                        onClick={handleActions}>Save</button>
                                                                    {showLoader && (
                                                                        <img src={Images.loder} className="ps-1" style={{ width: "25px" }} />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                })}
                                                {dummyBoxCount > 0 && [...Array(dummyBoxCount)].map((_, dummyIndex) => (
                                                    <div className='col-md-3' key={`dummy-${dummyIndex}`}>
                                                        <div className='units_box row p-1 mx-2 gre_dummy_boxes' style={{ height: "100%" }}>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            {FloorUnitDetails?.floor_details?.map((item, index) => {
                                return index == 0 && (
                                    <div className='row py-2' key={index}>
                                        <div className='col-md-3 pe-0 row align-items-center'>
                                            {bulkEditFlag == 1 &&
                                                <div className='d-flex justify-content-start text-center font-13 align-items-center'>
                                                    <label className='cursor-pointer fw-bold me-2'
                                                        onClick={handleCancelBulkEdit}>Cancel</label>
                                                    <label className='cursor-pointer SuccessBtn p-1'
                                                        style={{ fontSize: "12px" }} onClick={handleSaveBulkEdit}>
                                                        Save Changes</label>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='row align-items-center pt-3 pb-2'>
                            <div className='col-md-8 offset-md-2'>
                                <div className="progress" style={{ height: "7px" }}>
                                    <div className="progress-bar" role="progressbar" style={{ width: `${progressPercentage}%` }} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div className='col-1 d-flex justify-content-end'>
                                <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrev}
                                    className={`scroll-icon me-3 ${currentIndex > 0 ? 'activescrollicon' : 'disabledscrollicon'}`} />
                                <FontAwesomeIcon icon={faChevronRight} onClick={handleNext}
                                    className={`scroll-icon ${currentIndex + itemsPerPage < maxLengthOfUnits ? 'activescrollicon' : 'disabledscrollicon'}`} />
                            </div>
                        </div>
                        <div className='col-12 text-center pt-3 wing_name'>{FloorUnitDetails.name} Wing </div>
                        {nextWingId && (
                            <div className='col-12 text-end text-decoration-underline cursor-pointer'
                                onClick={(e) => { setActiveWingId(nextWingId); getFloorsUnits(nextWingId) }}>
                                Go to next Wing
                            </div>
                        )}
                    </div>
                    <div className='col-md-3 buildingbase mb-5' ></div>
                    <div className='col-md-6' style={{ borderTop: "8px solid #303260" }}></div>
                    <div className='col-md-3 buildingbase mb-5'></div>
                </div >
            </div >

            {PlanPopup && <UpgradePlanPopup show={PlanPopup} onHide={() => setPlanPopup(false)}
                data={planResponse} getfunction={(e) => refreshPropertyDetails()} />}

            <CustomModal isShow={BookingModel} size={"lg"} title="Add Booking Details" closePopup={(e) => setBookingModel(false)}
                bodyContent={<BookingPopup setBookingModel={setBookingModel} unitid={unitId} />} />

            <CustomModal isShow={InterstedLeadPopup} size={"md"} title="Add Intersted Leads" closePopup={(e) => setInterstedLeadPopup(false)}
                bodyContent={<InterstedLeadsPopup setInterstedLeadPopup={setInterstedLeadPopup} unitId={unitId} setShowAlerts={setShowAlerts} />} />

            <CustomModal isShow={ViewBookingModal} size={"lg"} title="View Booking Details" closePopup={(e) => { setViewBookingModal(false); refreshPropertyDetails() }}
                bodyContent={<ViewBookingPopup BookingDetails={BookingDetails} unitId={unitId}
                    setloading={setloading} setShowAlerts={setShowAlerts} />} />

            <CustomModal isShow={scanChequeModal} size={"lg"} title="Scan Cheque For Booking" closePopup={(e) => setScanChequeModal(false)}
                bodyContent={<ScanChequePopup setScanChequeModal={setScanChequeModal} setShowAlerts={setShowAlerts}
                    setloading={setloading} />} />

            <CustomModal isShow={UnitNamePopupShow} size={"md"} title={`Update Unit Names of ${FloorUnitDetails.name} Wing`}
                closePopup={(e) => setUnitNamePopupShow(false)}
                bodyContent={<UnitNamePopup setShowAlerts={setShowAlerts}
                    setloading={setloading} FloorUnitDetails={FloorUnitDetails} closePopup={(e) => setUnitNamePopupShow(false)} />} />
        </>
    )
}
