import React, { useCallback, useEffect, useState } from 'react'
import Images from '../../utils/Images';
import { useNavigate, useParams } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import CustomModal from '../../utils/CustomModal';
import Cookies from 'js-cookie'
import { debounce } from 'lodash';
import useApiService from '../../hooks/useApiService';
import useProperty from '../../hooks/useProperty';
import FilterModal from './FilterModal';
import { faChevronLeft, faChevronRight, faCircleChevronLeft, faCircleChevronRight, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/loader/Loader';

export default function AllProperties() {
    var cdnurl = import.meta.env.VITE_CDN_KEY;
    var { getAPIAuthKey } = useApiService();
    const { logout } = useAuth();
    const userId = Cookies.get('userId');
    const { switchProperty } = useProperty();
    const [searchstring, setsearchstring] = useState(null);
    const [propertiesData, setpropertiesData] = useState({
        Commercial: [],
        Residential: []
    });
    const [currentCommercialIndex, setCurrentCommercialIndex] = useState(0);
    const [currentResidentialIndex, setCurrentResidentialIndex] = useState(0);
    const navigate = useNavigate();
    const [FilterPopup, setFilterPopup] = useState(false);
    const [loading, setloading] = useState(false);
    const [ShowResetFilter, setShowResetFilter] = useState(false);
    const itemsPerPage = 4;
    const [FilterData, setFilterData] = useState({
        state: 0,
        city: 0,
        area: 0
    })
    useEffect(() => {
        GetPropertiesData(null, 0, 0, 0);
    }, [])
    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setsearchstring(searchValue);
            GetPropertiesData(searchValue, FilterData.state, FilterData.city, FilterData.area);
        }, 500),
        [FilterData]
    );

    const GetPropertiesData = async (searchstring, state, city, area) => {
        try {
            setloading(true);
            var stateval = state == 0 ? null : state;
            var cityval = city == 0 ? null : city;
            var areaval = area == 0 ? null : area;
            const apiUrl = `/get-all-properties/${userId}&${stateval}&${cityval}&${areaval}`;
            const result = await getAPIAuthKey(apiUrl);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setloading(false);
            setpropertiesData({
                Commercial: responseRs.commercialProperties.filter(property =>
                    filterProperties(property, searchstring)),
                Residential: responseRs.residentialProperties.filter(property =>
                    filterProperties(property, searchstring))
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    const filterProperties = (property, searchstring) => {
        if (!searchstring) return true; // No search string means no filtering
        const searchText = searchstring.toLowerCase();
        return (
            property.name?.toLowerCase().includes(searchText) ||
            property.city_name?.toLowerCase().includes(searchText) ||
            property.area?.toLowerCase().includes(searchText)
        );
    };
    const handleHidePopup = () => {
        setFilterPopup(false);
        setFilterData({
            ...FilterData,
            state: 0,
            city: 0,
            area: 0
        });
    }
    const handleApplyFilter = () => {
        handleHidePopup();
        GetPropertiesData(searchstring, FilterData.state, FilterData.city, FilterData.area);
        setShowResetFilter(true);
    }
    const getCardClick = async (item) => {
        setloading(true);
        Cookies.set('schemeId', item.id, { expires: 1 });
        await switchProperty(item.id);
        setTimeout(() => {
            setloading(false);
            navigate("/sales");
        }, 2000);

    }
    const handleNextCommercial = () => {
        if (currentCommercialIndex + itemsPerPage < propertiesData.Commercial.length) {
            setCurrentCommercialIndex(currentCommercialIndex + itemsPerPage);
            const scrollContainer = document.querySelector('.scroll-container-commercial');
            if (scrollContainer) {
                scrollContainer.scrollBy({ left: scrollContainer.offsetWidth + 1000, behavior: 'smooth' });
            }
        }
    };
    const handlePrevCommercial = () => {
        if (currentCommercialIndex > 0) {
            setCurrentCommercialIndex(currentCommercialIndex - itemsPerPage);
            const scrollContainer = document.querySelector('.scroll-container-commercial');
            if (scrollContainer) {
                scrollContainer.scrollBy({ left: -scrollContainer.offsetWidth - 1000, behavior: 'smooth' });
            }
        }
    };
    const handleNextResidential = () => {
        if (currentResidentialIndex + itemsPerPage < propertiesData.Residential.length) {
            setCurrentResidentialIndex(currentResidentialIndex + itemsPerPage);
            const scrollContainer = document.querySelector('.scroll-container-residential');
            if (scrollContainer) {
                scrollContainer.scrollBy({ left: scrollContainer.offsetWidth + 1000, behavior: 'smooth' });
            }
        }
    };

    const handlePrevResidential = () => {
        if (currentResidentialIndex > 0) {
            setCurrentResidentialIndex(currentResidentialIndex - itemsPerPage);
            const scrollContainer = document.querySelector('.scroll-container-residential');
            if (scrollContainer) {
                scrollContainer.scrollBy({ left: -scrollContainer.offsetWidth - 1000, behavior: 'smooth' });
            }
        }
    };
    return (
        <>
            {loading && <Loader runningcheck={loading} />}
            <div className="content-area h-100vh p-3">
                <div className='row align-items-center '>
                    <div className='col-md-5 fontwhite'>
                        <h3 className='mb-0 fw-bold'>Your Schemes</h3>
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
                                    debouncedSearch(e.target.value)
                                }}
                            />
                            <img src={Images.filter} alt="search-icon" className="filter-icon cursor-pointer"
                                title='Filter Properties' onClick={(e) => { setFilterPopup(true); setFilterData({ ...FilterData, state: 0, city: 0, area: 0 }); }} />
                        </div>
                    </div>
                    <div className='col-md-2 ps-0 d-flex justify-content-end'>
                        <button type='button' className='WhiteBtn w-100 p-2' onClick={(e) => navigate('/add-scheme', { state: { ShowBack: true } })}>
                            <img src={Images.blackaddicon} className='img-fluid pe-2' />Add Scheme
                        </button>
                        <div className='fontwhite  ps-2 cursor-pointer' onClick={logout}>
                            <FontAwesomeIcon icon={faRightFromBracket} className='logout-icon' />
                        </div>
                    </div>
                </div >
                {propertiesData?.Commercial?.length > 0 &&
                    <div className='row my-4'>
                        <div className='col-11'>
                            <h5 className='fontwhite fw-semibold'>Commercial ({propertiesData?.Commercial?.length})</h5>
                        </div>

                        {propertiesData.Commercial.length > itemsPerPage && (
                            <div className='col-1 d-flex justify-content-evenly'>
                                <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrevCommercial}
                                    className={` ${currentCommercialIndex > 0 ? 'back-prev-icon activeIcon' : 'back-prev-icon disabled'}`} />
                                <FontAwesomeIcon icon={faChevronRight} onClick={handleNextCommercial}
                                    className={` ${currentCommercialIndex + itemsPerPage < propertiesData.Commercial.length ? 'back-prev-icon activeIcon' : 'back-prev-icon disabled'}`} />
                            </div>
                        )}
                        <div className="scroll-container scroll-container-commercial">
                            <div className="d-flex flex-wrap">
                                {propertiesData.Commercial.slice(currentCommercialIndex, currentCommercialIndex + itemsPerPage).map((item, index) => (
                                    <PropertyCard
                                        key={index}
                                        cardclick={() => getCardClick(item)}
                                        city={item.city_name}
                                        img={item.property_img ? `${cdnurl}/${item.property_img}` : Images.dummy_property}
                                        name={item.name}
                                        area={item.area}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                }
                {
                    propertiesData?.Residential?.length > 0 &&
                    <div className='row my-4'>
                        <div className='col-11'>
                            <h5 className='fontwhite fw-semibold'>Residential ({propertiesData?.Residential?.length})</h5>
                        </div>
                        {propertiesData.Residential.length > itemsPerPage && (
                            <div className='col-1 d-flex justify-content-evenly'>
                                <FontAwesomeIcon icon={faChevronLeft} onClick={handlePrevResidential}
                                    className={` ${currentResidentialIndex > 0 ? 'back-prev-icon activeIcon' : 'back-prev-icon disabled'}`} />
                                <FontAwesomeIcon icon={faChevronRight} onClick={handleNextResidential}
                                    className={` ${currentResidentialIndex + itemsPerPage < propertiesData.Residential.length ? 'back-prev-icon activeIcon' : 'back-prev-icon disabled'}`} />
                            </div>
                        )}
                        <div className="scroll-container scroll-container-residential">
                            <div className="d-flex flex-wrap">
                                {propertiesData.Residential.slice(currentResidentialIndex, currentResidentialIndex + itemsPerPage).map((item, index) => (
                                    <PropertyCard
                                        key={index}
                                        cardclick={() => getCardClick(item)}
                                        city={item.city_name}
                                        img={item.property_img ? `${cdnurl}/${item.property_img}` : Images.dummy_property}
                                        name={item.name}
                                        area={item.area}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                }
                {
                    propertiesData?.Commercial?.length == 0 && propertiesData?.Residential?.length == 0 && (
                        <h5 className='col-12 text-center p-5 fontwhite'>No Record Found</h5>
                    )
                }
            </div >

            <CustomModal isShow={FilterPopup} size={"md"} title="Filter By"
                bodyContent={<FilterModal setFilterData={setFilterData} FilterData={FilterData} />} closePopup={handleHidePopup} footerButtons={[
                    { btnColor: 'CancelBtn', onClick: handleHidePopup, label: "Clear" },
                    { btnColor: 'SuccessBtn', onClick: handleApplyFilter, label: "Apply" }
                ]} />
        </>
    )
}
