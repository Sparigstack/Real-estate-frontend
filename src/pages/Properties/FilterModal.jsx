import React, { useEffect, useState } from 'react'
import useCommonApiService from '../../hooks/useCommonApiService';
import Cookies from 'js-cookie';

export default function FilterModal({ setFilterData, FilterData }) {
    const { getCities, getArea, getAllStates } = useCommonApiService();
    const userId = Cookies.get('userId');
    const [FilterDataDetails, setFilterDataDetails] = useState({
        state_array: [],
        city_array: [],
        area_array: []
    })
    useEffect(() => {
        async function fetchData() {
            const states = await getAllStates();
            setFilterDataDetails({ ...FilterDataDetails, state_array: states })
        }
        fetchData();
    }, []);
    const GetCities = async (stateid) => {
        const cities = await getCities(stateid);
        setFilterDataDetails((prevdata) => ({ ...prevdata, city_array: cities }))
    }
    const GetArea = async (cityid) => {
        const areas = await getArea(userId, cityid);
        setFilterDataDetails((prevdata) => ({ ...prevdata, area_array: areas }))
    }
    return (
        <div className='row'>
            <div className='col-md-4 ps-0 position-relative '>
                <label className='input-labels'>State</label>
                <select className="custom-inputs" name='state' onChange={(e) => { setFilterData({ ...FilterData, state: e.target.value }); GetCities(e.target.value) }}>
                    <option value="0" label="Select State" />
                    {FilterDataDetails?.state_array?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </select>
            </div>
            <div className='col-md-4 ps-0 position-relative '>
                <label className='input-labels'>City</label>
                <select className="custom-inputs" name='city' onChange={(e) => { setFilterData({ ...FilterData, city: e.target.value }); GetArea(e.target.value) }}>
                    <option value="0" label="Select City" />
                    {FilterDataDetails?.city_array?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </select>
            </div>
            <div className='col-md-4 ps-0 position-relative '>
                <label className='input-labels'>Area</label>
                <select className="custom-inputs" name='area' onChange={(e) => setFilterData({ ...FilterData, area: e.target.value })}>
                    <option value="0" label="Select Area" />
                    {FilterDataDetails?.area_array?.map((item, index) => {
                        return <option value={item} label={item} key={index} />
                    })}
                </select>
            </div>
        </div>
    )
}
