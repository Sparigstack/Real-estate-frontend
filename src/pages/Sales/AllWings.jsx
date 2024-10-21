import React, { useEffect, useState } from 'react'
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';
import Images from '../../utils/Images';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import AddFloorsUnits from './AddFloorsUnits';
import AllFloorsUnits from './AllFloorsUnits';

export default function AllWings() {
    const [loading, setLoading] = useState(false);
    const { getAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const navigate = useNavigate();
    const [WingDetails, setWingDetails] = useState({
        totalWings: 0,
        totalUnits: 0,
        wingsArray: []
    })
    const [FloorUnitDetails, setFloorUnitDetails] = useState([])
    const [activeWingId, setActiveWingId] = useState(null);
    useEffect(() => {
        const getAllWings = async () => {
            try {
                setLoading(true);
                const result = await getAPIAuthKey(`/get-property-wings-basic-details/${schemeId}`);
                if (!result || result == "") {
                    alert('Something went wrong');
                }
                else {
                    const responseRs = JSON.parse(result);
                    setLoading(false);
                    setWingDetails({
                        ...WingDetails, totalWings: responseRs?.building_wings_count, totalUnits: responseRs?.total_units,
                        wingsArray: responseRs?.wings
                    })
                    setActiveWingId(responseRs?.wings[0]?.wing_id);
                    getFloorsUnits(responseRs?.wings[0]?.wing_id);
                }
            }
            catch (error) {
                setLoading(false);
                console.error(error);
            }
        }
        getAllWings();

    }, []);
    const getFloorsUnits = async (wingid) => {
        try {
            setLoading(true);
            const result = await getAPIAuthKey(`/get-wings-basic-details/${wingid}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setFloorUnitDetails(responseRs)
                setLoading(false);
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    return (
        <div>
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                Sales
            </div>
            <div className='PageHeader mt-3'>
                <div className='row align-items-center'>
                    <div className='col-md-4 font-15'>
                        <label className='ps-2'>
                            Total Wings : <b>{WingDetails.totalWings}</b>
                        </label>
                        <label className='ps-5'>
                            Total Units : <b>{WingDetails.totalUnits}</b>
                        </label>
                    </div>
                    <div className='col-md-8 d-flex fw-normal align-items-center justify-content-end font-12'>
                        <div className='d-flex align-items-center pe-3'>
                            <div className="sales-legends me-1" style={{ background: "white" }}></div>
                            <label>Available</label>
                        </div>
                        <div className='d-flex align-items-center pe-3'>
                            <div className="sales-legends me-1" style={{ background: "#E3F6EC", border: "1.5px solid #08A95C" }}></div>
                            <label>Booked(Allotted)</label>
                        </div>
                        <div className='d-flex align-items-center pe-3'>
                            <div className="sales-legends me-1" style={{ background: "#E4EAF6", border: "1.5px solid #0055FF" }}></div>
                            <label>Interested Leads</label>
                        </div>
                        <div className='d-flex align-items-center'>
                            <div className="sales-legends me-1" style={{ background: "#FFF8E1", border: "1.5px solid #FF8C01" }}></div>
                            <label>Booked(Payment inprogress)</label>
                        </div>
                    </div>
                </div>
                <div className='row pt-3'>
                    {WingDetails?.wingsArray?.map((item, index) => {
                        return <div className='col-md-2' key={index} >
                            <div className={`${activeWingId == item.wing_id ? 'subPropertyTypeActive' : 'subPropertyTypesBtn'} cursor-pointer text-center`}
                                style={{ height: "100%" }} onClick={(e) => { setActiveWingId(item.wing_id); getFloorsUnits(item.wing_id) }}>
                                <b>{item.wing_name}</b>
                                <div className='fw-normal font-13 pt-1'>Total Floors : {item.total_floors}</div>
                                <div className='fw-normal font-13'>Total Units : {item.total_units}</div>
                            </div>
                        </div>
                    })}
                    <div className='col-md-2' >
                        <div className='addwingsBox text-center p-3 font-13 cursor-pointer' style={{ height: "100%" }} onClick={(e) => navigate('/add-wings')}>
                            <img src={Images.addicon} alt="commercial" className='py-2' />
                            <br />
                            Add New Wing
                        </div>
                    </div>
                </div>
            </div>
            {FloorUnitDetails?.floor_details_count > 0 ?
                <AllFloorsUnits FloorUnitDetails={FloorUnitDetails} activeWingId={activeWingId} />
                : FloorUnitDetails?.floor_details_count == 0 ?
                    <AddFloorsUnits activeWingId={activeWingId} setLoading={setLoading} getFloorsUnits={getFloorsUnits} />
                    :
                    null
            }
        </div>
    )
}
