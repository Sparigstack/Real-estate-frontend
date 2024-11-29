import React, { useEffect, useState } from 'react'
import useProperty from '../../hooks/useProperty'
import Images from '../../utils/Images';
import { formatCurrency } from '../../utils/js/Common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import CustomModal from '../../utils/CustomModal';
import InterstedLeadsPopup from './InterstedLeadsPopup';
import BookingPopup from './BookingPopup';
import ViewBookingPopup from './ViewBookingPopup';
import VillaBunglowNamePopup from './VillaBunglowNamePopup';

export default function AllVillaBungalow({ setShowAddForm, setloading, setShowAlerts }) {
    const { propertyDetails, schemeId, refreshPropertyDetails } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [units, setUnits] = useState(propertyDetails?.unit_details || []);
    const [showLoader, setshowLoader] = useState(false);
    const [unitId, setUnitId] = useState(false);
    const [InterstedLeadPopup, setInterstedLeadPopup] = useState(false);
    const [BookingModel, setBookingModel] = useState(false);
    const [ViewBookingModal, setViewBookingModal] = useState(false);
    const [UnitNamePopupShow, setUnitNamePopupShow] = useState(false);
    const [bulkEditFlag, setbulkEditFlag] = useState(0);
    const [BookingDetails, setBookingDetails] = useState({
        bookingtype: '',
        userid: ''
    })
    const [ActionDetails, setActionDetails] = useState({
        unitId: null,
        unitSize: "",
        price: ""
    })

    useEffect(() => {
        setUnits(propertyDetails?.unit_details)
    }, [propertyDetails])

    const handleSingleUnitEdit = (id, flagValue = 1) => {
        setUnits((prevUnits) =>
            prevUnits.map((unit) =>
                unit.id == id
                    ? { ...unit, flag: flagValue }
                    : unit
            )
        );
        setActionDetails(prevUnits => ({
            ...prevUnits,
            unitSize: 0,
            price: 0,
            unitId: id
        }));
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
                    setUnits((prevUnits) =>
                        prevUnits.map((unit) =>
                            unit.id == ActionDetails.unitId
                                ? {
                                    ...unit,
                                    square_feet: ActionDetails.unitSize,
                                    price: ActionDetails.price,
                                    flag: 0,
                                }
                                : unit
                        )
                    );
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
    const handleInputChange = (unitId, newSize, newPrice) => {
        var firstUnitId = units?.length && units[0].id;
        setActionDetails((prevDetails) => ({
            ...prevDetails,
            unitId: unitId,
            unitSize: newSize || prevDetails.unitSize,
            price: newPrice || prevDetails.price,
        }));

        setUnits((prevUnits) =>
            prevUnits.map((unit) => {
                if (bulkEditFlag == 1 && firstUnitId == unitId) {
                    return {
                        ...unit,
                        square_feet: newSize || unit.square_feet,
                        price: newPrice || unit.price,
                    };
                }

                if (unit.id == unitId) {
                    return {
                        ...unit,
                        square_feet: newSize || unit.square_feet,
                        price: newPrice || unit.price,
                    };
                }

                return unit;
            })
        );

    };
    const handleBulkEdit = () => {
        setbulkEditFlag(1);
        setUnits((prevUnits) =>
            prevUnits.map((unit) => ({ ...unit, flag: 1 }))
        );
    };
    const handleBulkCancel = () => {
        setbulkEditFlag(0);
        setUnits((prevUnits) =>
            prevUnits.map((unit) => ({ ...unit, flag: 0 }))
        );
    };

    const handleSaveBulkEdit = async () => {
        setloading(true);
        const updates = units.map((unit) => ({
            unitId: unit.id,
            square_feet: unit.square_feet,
            price: unit.price,
        }));
        var raw = JSON.stringify({
            propertyId: schemeId,
            wingDetails: null,
            flagforvilla: 1,
            unitDetails: updates
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

    return (
        <div>
            <div className='PageHeader mt-3'>
                <div className='row align-items-center'>
                    <div className='col-md-4 font-15'>
                        <label className='ps-2 light-grey-color'>
                            Total {propertyDetails?.property_name}s : <b>{propertyDetails?.total_units}</b>
                        </label>
                    </div>
                    <div className='col-md-8 d-flex justify-content-end fw-normal align-items-center font-12'>
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
                </div>
                <div className='villabunglowimage greyColor mt-3 py-2 px-3 h-100'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <label className='cursor-pointer font-13 fw-bold text-decoration-underline'
                                title='Edit Unit Names' style={{ color: "#03053D" }} onClick={(e) => setUnitNamePopupShow(true)}>
                                Edit {propertyDetails?.property_name}s Names
                            </label>
                        </div>
                        <div className='col-md-6'>
                            <div className='d-flex justify-content-end font-13'>
                                {bulkEditFlag != 1 && (
                                    <div className='d-flex cursor-pointer align-items-center' title={`Edit All Units`}
                                        onClick={handleBulkEdit}>
                                        <img src={Images.bulk_edit} className='pe-2 w-25 h-100' />
                                        <label className='cursor-pointer' style={{ color: "#03053D" }}>Edit All</label>
                                    </div>
                                )}
                                <div className='d-flex cursor-pointer align-items-center' title={`Add ${propertyDetails?.property_name}`}
                                    onClick={(e) => setShowAddForm(true)}>
                                    <img src={Images.blackaddicon} className='pe-2 w-25 h-100' />
                                    <label className='cursor-pointer' style={{ color: "#03053D" }}>Add {propertyDetails?.property_name}</label>
                                </div>
                            </div>
                        </div>
                        {bulkEditFlag == 1 &&
                            <div className='d-flex justify-content-center text-center font-13 align-items-center'>
                                <label className='cursor-pointer fw-bold me-2' onClick={handleBulkCancel}>Cancel</label>
                                <label className='cursor-pointer SuccessBtn p-1' style={{ fontSize: "12px" }} onClick={handleSaveBulkEdit}>Save</label>
                            </div>
                        }
                    </div>
                    <div className='row pt-2'>
                        {units?.length &&
                            units?.map((item, index) => {
                                var statusboxes = '';
                                var statuscolor = '';
                                var paymentStatusPercentage = 0;
                                if (item.booking_status == 2) {
                                    statusboxes = 'blue_box'; //intersted leads
                                    statuscolor = 'blue_text';
                                } else if (item.booking_status == 3) {
                                    statusboxes = 'green_box'; //booked(allocated)
                                    statuscolor = 'green_text';
                                } else if (item.booking_status == 4) {
                                    statusboxes = 'orange_box'; //booked(payment in progress)
                                    statuscolor = 'orange_text';
                                }
                                if (item.price > 0) {
                                    paymentStatusPercentage = Math.round((item.total_paid_amount / item.price) * 100);
                                }
                                return <div className='col-md-3 px-0 py-2' key={index}>
                                    <div className={`units_box row p-1 mx-2 ${statusboxes}`} style={{ height: "100%" }}>
                                        <div className='col-10'>
                                            <div className={`font-14 ${statuscolor}`}>{item.name}</div>
                                            <div className='font-12 pt-2 greyColor fw-medium'>Unit Size :
                                                {item?.flag == 1 ?
                                                    <div className="input-group">
                                                        <input type="number" min={0} className="form-control p-0 px-1 font-13" name='sqft' autoComplete='off'
                                                            value={item.square_feet} onChange={(e) => handleInputChange(item.id, e.target.value, item.price)} />
                                                        <span className="input-group-text p-1">
                                                            <label className='font-12'>sqft</label>
                                                        </span>
                                                    </div>
                                                    :
                                                    <label className='ps-1'>{item.square_feet || 0} sqft</label>
                                                }
                                            </div>
                                            <div className='font-12 pt-2 greyColor fw-medium'>Unit Price :
                                                {item?.flag == 1 ?
                                                    <div className="input-group">
                                                        <input type="number" min={0} className="form-control p-0 px-1 font-13" name='price'
                                                            autoComplete='off' value={item.price} onChange={(e) => handleInputChange(item.id, item.square_feet, e.target.value)} />
                                                        <span className="input-group-text">
                                                            <FontAwesomeIcon icon={faIndianRupeeSign} className='font-12' />
                                                        </span>
                                                    </div>
                                                    :
                                                    <label className='ps-1'>
                                                        {formatCurrency(item.price || 0)}
                                                        <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1' />
                                                    </label>
                                                }
                                            </div>
                                            <div className='font-12 pt-2 greyColor fw-medium'>Received :
                                                <label className='ps-1'>
                                                    {formatCurrency(item.total_paid_amount || 0)}
                                                    <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1' />
                                                </label>
                                            </div>
                                        </div>
                                        <div className='col-md-2 p-0'>
                                            {bulkEditFlag == 1 ?
                                                <img src={Images.grey_edit}
                                                    className={`cursor-nodrop mb-1 units_box bigiconsize p-1`} />
                                                :
                                                <img src={item?.flag == 1 ? Images.white_edit : Images.grey_edit}
                                                    className={`cursor-pointer mb-1 ${item?.flag == 1 ? 'active_units_box' : 'units_box'} bigiconsize p-1`} title="Edit Unit"
                                                    onClick={() => { handleSingleUnitEdit(item.id); }} />
                                            }

                                            <img src={BookingModel == true && unitId == item.id ? Images.booking_white : Images.booking}
                                                className={`cursor-pointer mb-1 ${BookingModel == true && unitId == item.id ? 'active_units_box' : 'units_box'} bigiconsize p-1`}
                                                title='Add Booking Details'
                                                onClick={(e) => { setBookingModel(true); setUnitId(item.id) }} />

                                            <img src={InterstedLeadPopup == true && unitId == item.id ? Images.white_lead : Images.lead}
                                                className={`cursor-pointer ${InterstedLeadPopup == true && unitId == item.id ? 'active_units_box' : 'units_box'} bigiconsize p-1`} title='Add Leads'
                                                onClick={(e) => { setInterstedLeadPopup(true); setUnitId(item.id) }} />
                                        </div>
                                        {item.price > 0 && item.booking_status == 4 && (
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
                                        {item.booking_status == 2 && (
                                            <div className='col-12 d-flex align-items-center pt-1 cursor-pointer' onClick={(e) => { setInterstedLeadPopup(true); setUnitId(item.id) }}>
                                                <img src={Images.blue_lead} className='iconsize pe-1' />
                                                <b className={`blue_text font-14`} style={{ borderBottom: "2px solid #0055FF" }}>{item?.interested_lead_count} Leads</b>
                                            </div>
                                        )}
                                        {item.booking_status == 3 || item.booking_status == 4 ? (
                                            item?.allocated_entities?.length > 0 && (
                                                item?.allocated_entities?.map((entitiesitem, index) => {
                                                    return <div className='col-12' key={index}>
                                                        <div className='col-12 d-flex align-items-center pt-1'>
                                                            {item.booking_status == 4 && (
                                                                <img src={Images.whatsapp} className='iconsize pe-2 cursor-pointer' title='Send Reminder' />
                                                            )}
                                                            <b className={`${item.booking_status == 4 ? 'orange_text' : 'green_text'} font-14 text-decoration-underline cursor-pointer`} title='View Booking Details'
                                                                onClick={(e) => { setViewBookingModal(true); setUnitId(item.id); setBookingDetails({ ...BookingDetails, bookingtype: entitiesitem.allocated_lead_id ? 1 : 2, userid: entitiesitem.allocated_lead_id ? entitiesitem.allocated_lead_id : entitiesitem.allocated_customer_id }) }}>
                                                                {entitiesitem.allocated_name}
                                                            </b>
                                                        </div>
                                                    </div>
                                                })
                                            )

                                        ) : null}
                                        {item?.flag == 1 && bulkEditFlag == 0 && (
                                            <div className='col-12 d-flex pt-2 justify-content-end pe-0'>
                                                <button className='CancelBtn py-0 px-2 me-2 font-12'
                                                    onClick={(e) => { handleSingleUnitEdit(item.id, 0); refreshPropertyDetails(false); }}>Cancel</button>
                                                <button className='SuccessBtn py-0 px-2 font-12' onClick={handleActions}>Save</button>
                                                {showLoader && (
                                                    <img src={Images.loder} className="ps-1" style={{ width: "25px" }} />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            })}

                    </div>
                </div>
            </div>
            <CustomModal isShow={InterstedLeadPopup} size={"md"} title="Add Intersted Leads" closePopup={(e) => setInterstedLeadPopup(false)}
                bodyContent={<InterstedLeadsPopup setInterstedLeadPopup={setInterstedLeadPopup} unitId={unitId} setShowAlerts={setShowAlerts} />} />

            <CustomModal isShow={BookingModel} size={"lg"} title="Add Booking Details" closePopup={(e) => setBookingModel(false)}
                bodyContent={<BookingPopup setBookingModel={setBookingModel} unitid={unitId} />} />

            <CustomModal isShow={ViewBookingModal} size={"lg"} title="View Booking Details" closePopup={(e) => { setViewBookingModal(false); refreshPropertyDetails() }}
                bodyContent={<ViewBookingPopup BookingDetails={BookingDetails} unitId={unitId}
                    setloading={setloading} setShowAlerts={setShowAlerts} />} />

            <CustomModal isShow={UnitNamePopupShow} size={"md"} title={`Update ${propertyDetails?.property_name}s Names`}
                closePopup={(e) => setUnitNamePopupShow(false)}
                bodyContent={<VillaBunglowNamePopup setShowAlerts={setShowAlerts}
                    setloading={setloading} unitDetails={propertyDetails?.unit_details} closePopup={(e) => setUnitNamePopupShow(false)} />} />
        </div>
    )
}
