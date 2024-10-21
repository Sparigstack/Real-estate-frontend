import React, { useEffect, useState } from 'react'
import Images from '../../utils/Images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '../../utils/js/Common';

export default function AllFloorsUnits({ FloorUnitDetails, activeWingId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
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
    return (
        <div className='container px-4'>
            <div className='d-flex justify-content-end font-13 fontwhite py-3 pe-3'>
                <div className='d-flex cursor-pointer align-items-center '>
                    <img src={Images.addicon} className='pe-2 iconsize' />
                    <label>Add Floors</label>
                </div>
                <div className='d-flex cursor-pointer align-items-center  ps-3'>
                    <img src={Images.bulk_edit} className='pe-2 iconsize' />
                    <label>Bulk Edit</label>
                </div>
            </div>
            <div className='row'>
                <div className='buildingimage pb-5 pt-4 px-3 h-100'>
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
                                <div className='col-md-2 d-flex align-items-center justify-content-evenly'>
                                    <img src={Images.delete_icon} className='cursor-pointer img-fluid' title='Delete floor' />
                                    <div>
                                        <div className='fw-bold'>Floor {floorNumber}</div>
                                        <div className='greyColor font-12'>({item.unit_details[0]?.name} to {item.unit_details[endUnit]?.name})</div>
                                    </div>
                                </div>
                                <div className="col-md-10 row p-0 pt-1">
                                    <div className="scroll-container scroll-container-commercial p-0">
                                        <div className="d-flex flex-wrap">
                                            {item.unit_details?.slice(currentIndex, currentIndex + itemsPerPage).map((units, unitindex) => {
                                                return <div className='col-md-3' key={unitindex}>
                                                    <div className='units_box row py-3 px-2 m-2'>
                                                        <div className='col-md-10'>
                                                            <div className='font-15 '>{units.name}</div>
                                                            <div className='font-13 pt-2 greyColor'>Unit Size :&nbsp;{units.square_feet || 0} sqft</div>
                                                            <div className='font-13 greyColor pt-2'>Unit Price :&nbsp;
                                                                <FontAwesomeIcon icon={faIndianRupeeSign} className='pe-1' />{units.square_feet || 0}
                                                                {formatCurrency(units.square_feet || 0)}</div>
                                                        </div>
                                                        <div className='col-md-2 p-0 d-grid'>
                                                            <img src={Images.grey_edit} className='cursor-pointer units_box bigiconsize p-1' title='Edit Unit' />
                                                            <img src={Images.grey_delete} className='cursor-pointer units_box bigiconsize p-1 my-1' title='Delete Unit' />
                                                            <img src={Images.grey_info} className='cursor-pointer units_box bigiconsize p-1' title='View Info' />
                                                        </div>
                                                    </div>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                <div className='col-md-4 buildingbase mb-5' ></div>
                <div className='col-md-4' style={{ borderTop: "8px solid #303260" }}></div>
                <div className='col-md-4 buildingbase mb-5'></div>
            </div>
        </div>
    )
}
