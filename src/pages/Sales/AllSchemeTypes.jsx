import React, { useEffect, useState } from 'react'
import Images from '../../utils/Images';
import { useNavigate } from 'react-router-dom';
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';
import Loader from '../../components/loader/Loader';
import AllFloorsUnits from './AllFloorsUnits';
import AddFloorsUnits from './AddFloorsUnits';

export default function AllSchemeTypes() {
    const navigate = useNavigate();
    const { getAPIAuthKey } = useApiService();
    const { propertyDetails } = useProperty();
    const [ShowAddFloordiv, setShowAddFloordiv] = useState(false);
    const [FloorUnitDetails, setFloorUnitDetails] = useState([])
    const [activeWingId, setActiveWingId] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (activeWingId) {
            setActiveWingId(activeWingId)
            getFloorsUnits(activeWingId);
        } else {
            if (propertyDetails?.wing_details?.length > 0) {
                setActiveWingId(propertyDetails?.wing_details[0]?.id);
                getFloorsUnits(propertyDetails?.wing_details[0]?.id);
            }
        }
    }, [activeWingId, propertyDetails]);

    const getFloorsUnits = async (wingid) => {
        if (wingid) {
            setLoading(true);
            try {
                const result = await getAPIAuthKey(`/get-wings-basic-details/${wingid}`);
                if (!result || result == "") {
                    alert('Something went wrong');
                }
                else {
                    setLoading(false);
                    const responseRs = JSON.parse(result);
                    setFloorUnitDetails(responseRs)
                    setShowAddFloordiv(false)
                }
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
    }
    const getNextWingId = () => {
        const currentIndex = propertyDetails?.wing_details?.findIndex(wing => wing.id == activeWingId);
        const nextIndex = currentIndex + 1;
        if (nextIndex < propertyDetails?.wing_details?.length) {
            return propertyDetails?.wing_details[nextIndex].id;
        }
        return null;
    };

    return (
        <div>
            {loading && <Loader runningcheck={loading} />}
            {propertyDetails?.building_wings_count > 0 && (
                <div className='PageHeader mt-3'>
                    <div className='row align-items-center'>
                        <div className='col-md-4 font-15'>
                            <label className='ps-2 light-grey-color'>
                                Total Wings : <b>{propertyDetails?.building_wings_count}</b>
                            </label>
                            <label className='ps-5 light-grey-color'>
                                Total Units : <b>{propertyDetails?.total_units}</b>
                            </label>
                        </div>
                    </div>
                    <div className='row pt-3'>
                        {propertyDetails?.wing_details?.map((item, index) => {
                            return <div className='col-md-2 py-1' key={index} >
                                <div className={`py-1 px-4 ${activeWingId == item.id ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer text-center`}
                                    style={{ height: "100%" }} onClick={(e) => { setActiveWingId(item.id); getFloorsUnits(item.id) }}>
                                    <b>{item.name}</b>
                                    <div className='fw-normal  font-13 pt-1'>Total Floors : {item.total_floors}</div>
                                    <div className='fw-normal font-13'>Total Units : {item.total_units_in_wing}</div>
                                </div>
                            </div>
                        })}
                        <div className='col-md-2 py-1' >
                            <div className='addwingsBox text-center p-3 font-13 cursor-pointer' style={{ height: "100%" }} onClick={(e) => navigate('/add-wings')}>
                                <img src={Images.addicon} alt="commercial" className='pb-2' />
                                <br />
                                Add New Wing
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {ShowAddFloordiv ?
                <AddFloorsUnits activeWingId={activeWingId}
                    UnitDetailsCount={FloorUnitDetails?.unit_details_count} setShowAddFloordiv={setShowAddFloordiv} />
                :
                FloorUnitDetails?.floor_details_count > 0 ?
                    <AllFloorsUnits FloorUnitDetails={FloorUnitDetails} activeWingId={activeWingId}
                        setFloorUnitDetails={setFloorUnitDetails} setShowAddFloordiv={setShowAddFloordiv}
                        nextWingId={getNextWingId()} setActiveWingId={setActiveWingId} getFloorsUnits={getFloorsUnits} />

                    : FloorUnitDetails?.floor_details_count == 0 ?
                        <AddFloorsUnits activeWingId={activeWingId} UnitDetailsCount={FloorUnitDetails?.unit_details_count} setShowAddFloordiv={setShowAddFloordiv} />

                        :
                        <div className='fontwhite text-center pt-5'>
                            <h1 className='fw-bold'>Welcome on-board!</h1>
                            <h6 className='pt-2'>Start managing your project Sales by adding wing details.</h6>
                            <button className='WhiteBtn mt-5 px-4' onClick={(e) => navigate('/add-wings')}>Add Wing</button>
                        </div>
            }
        </div>
    )
}
