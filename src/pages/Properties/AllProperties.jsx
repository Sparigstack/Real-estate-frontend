import React, { useCallback, useContext, useEffect, useState } from 'react'
import Images from '../../utils/Images';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import CustomModal from '../../utils/CustomModal';
import Cookies from 'js-cookie'
import { debounce } from 'lodash';
import ShowLoader from '../../components/loader/ShowLoader';
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';

export default function AllProperties() {
    var cdnurl = import.meta.env.VITE_CDN_KEY;
    var { getAPI } = useApiService();
    const userId = Cookies.get('userId');
    var { propertyType } = useParams();
    const { switchProperty } = useProperty();
    const [searchstring, setsearchstring] = useState(null);
    const [propertiesData, setpropertiesData] = useState([]);
    const navigate = useNavigate();
    const [FilterPopup, setFilterPopup] = useState(false);
    const [loding, setloding] = useState(false);
    const [ShowResetFilter, setShowResetFilter] = useState(false);
    const [FilterData, setFilterData] = useState({
        state: 0,
        city: 0,
        area: 0
    })
    const [FilterDataDetails, setFilterDataDetails] = useState({
        state_array: [],
        city_array: [],
        area_array: []
    })
    useEffect(() => {
        GetPropertiesData(null, 0, 0, 0);

    }, [])
    const debouncedSearch = useCallback(debounce((searchValue) => {
        GetPropertiesData(searchValue, 0, 0, 0);
    }, 500), []);
    const GetPropertiesData = async (searchstring, state, city, area) => {
        try {
            setloding(true);
            var search = searchstring == '' ? null : searchstring;
            var stateval = state == 0 ? null : state;
            var cityval = city == 0 ? null : city;
            var areaval = area == 0 ? null : area;
            const apiUrl = `/filter-properties/${userId}&${propertyType}&${search}&${stateval}&${cityval}&${areaval}`;
            const result = await getAPI(apiUrl, 3);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setloding(false);
            setpropertiesData(responseRs);
        }
        catch (error) {
            console.error(error);
        }
    }
    const handleHidePopup = () => {
        setFilterPopup(false);
        setFilterData({
            ...FilterData,
            state: 0,
            city: 0,
            area: 0
        });
        setFilterDataDetails({
            ...FilterDataDetails, state_array: [], city_array: [], area_array: []
        })
    }
    const handleApplyFilter = () => {
        handleHidePopup();
        GetPropertiesData(searchstring, FilterData.state, FilterData.city, FilterData.area);
        setShowResetFilter(true);
    }
    const GetAllStates = async () => {
        try {
            const result = await getAPI(`/get-state-details`, 3);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setFilterDataDetails({ ...FilterDataDetails, state_array: responseRs })
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    const GetCities = async (stateid) => {
        try {
            const result = await getAPI(`/get-state-with-cities-details/${stateid}`, 3);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setFilterDataDetails((prevdata) => ({ ...prevdata, city_array: responseRs?.cities }))
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    const GetArea = async (cityid) => {
        try {
            const result = await getAPI(`/get-area-with-cities-details/${userId}/${cityid}`, 3);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setFilterDataDetails((prevdata) => ({ ...prevdata, area_array: responseRs }))
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    const modalbody = (
        <div className='row'>
            <div className='col-md-4'>
                <label className='font-13'>State</label>
                <select className="form-control" name='state' onChange={(e) => { setFilterData({ ...FilterData, state: e.target.value }); GetCities(e.target.value) }}>
                    <option value="0" label="Select State" />
                    {FilterDataDetails?.state_array?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </select>
            </div>
            <div className='col-md-4'>
                <label className='font-13'>City</label>
                <select className="form-control" name='city' onChange={(e) => { setFilterData({ ...FilterData, city: e.target.value }); GetArea(e.target.value) }}>
                    <option value="0" label="Select City" />
                    {FilterDataDetails?.city_array?.map((item, index) => {
                        return <option value={item.id} label={item.name} key={index} />
                    })}
                </select>
            </div>
            <div className='col-md-4'>
                <label className='font-13'>Area</label>
                <select className="form-control" name='area' onChange={(e) => setFilterData({ ...FilterData, area: e.target.value })}>
                    <option value="0" label="Select Area" />
                    {FilterDataDetails?.area_array?.map((item, index) => {
                        return <option value={item} label={item} key={index} />
                    })}
                </select>
            </div>
        </div>
    )
    const getCardClick = async (item) => {
        setloding(true);
        Cookies.set('propertyId', item.id, { expires: 1, secure: true, sameSite: 'Strict' });
        Cookies.set('propertyName', item.name, { expires: 1, secure: true, sameSite: 'Strict' });
        await switchProperty(item.id, item.name);
        setTimeout(() => {
            setloding(false);
            navigate("/dashboard");
        }, 2000);

    }
    return (
        <>
            {loding && <ShowLoader />}
            <div className="content-area h-100vh p-3">
                <div className='row align-items-center '>
                    <div className='col-md-5 fontwhite d-flex'>
                        <img src={Images.backArrow} alt="back-arrow" style={{ height: "40px" }}
                            className='cursor-pointer' onClick={() => navigate('/properties')} />
                        <h3 className='mb-0 ps-4'>Your Properties !</h3>
                    </div>
                    <div className='col-md-2 fontwhite text-end' >
                        {ShowResetFilter && (
                            <label className=' cursor-pointer' onClick={(e) => {
                                GetPropertiesData(null, 0, 0, 0);
                                setFilterData({ ...FilterData, state: 0, city: 0, area: 0 });
                                setShowResetFilter(false);
                            }}>Reset Filters</label>
                        )}
                    </div>
                    <div className='col-md-3'>
                        <div className="position-relative">
                            <img src={Images.searchIcon} alt="search-icon" className="search-icon" />
                            <input
                                type="text"
                                className="form-control searchInput"
                                placeholder="Search here.."
                                onChange={(e) => {
                                    setsearchstring(e.target.value);
                                    debouncedSearch(e.target.value)
                                }}
                            />
                            <img src={Images.filter} alt="search-icon" className="filter-icon cursor-pointer"
                                title='Filter Properties' onClick={(e) => { setFilterPopup(true); setFilterData({ ...FilterData, state: 0, city: 0, area: 0 }); GetAllStates(); }} />
                        </div>
                    </div>
                    <div className='col-md-2 text-end '>
                        <button type='button' className='WhiteBtn w-100' onClick={(e) => navigate('/add-property', { state: { ShowBack: true } })}>
                            <img src={Images.blackaddicon} className='img-fluid pe-2' />Add Property
                        </button>
                    </div>
                </div>
                <div className='row my-4'>
                    <h5 className='fontwhite'>{propertyType == 1 ? 'Commercial' : 'Residential'}</h5>
                    <div className="d-flex flex-wrap">
                        {propertiesData.length > 0 ?
                            propertiesData?.map((item, index) => {
                                return <PropertyCard key={index} cardclick={(e) => getCardClick(item)} city={item?.city_name}
                                    img={item.property_img ? `${cdnurl}/${item.property_img}` : Images.dummy_property} name={item.name} area={item?.area} />
                            })
                            :
                            <div className='col-12 text-center fontwhite'>
                                <hr />
                                No Data Found
                            </div>
                        }
                    </div>
                </div>
            </div>

            <CustomModal isShow={FilterPopup} size={"md"} title="Filter By"
                bodyContent={modalbody} closePopup={handleHidePopup} footerButtons={[
                    { btnColor: 'CancelBtn', onClick: handleHidePopup, label: "Clear" },
                    { btnColor: 'SuccessBtn', onClick: handleApplyFilter, label: "Apply" }
                ]} />
        </>
    )
}
