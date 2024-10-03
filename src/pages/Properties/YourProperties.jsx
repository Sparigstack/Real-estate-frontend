import React, { useContext, useState } from 'react'
import Images from '../../utils/Images'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import HideLoader from '../../components/loader/HideLoader';
import ShowLoader from '../../components/loader/ShowLoader';

export default function YourProperties({ propertiesData }) {
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const getCardClick = (item) => {
        setloading(true);
        Cookies.set('propertyId', item.id, { expires: 1, secure: true, sameSite: 'Strict' });
        setTimeout(() => {
            setloading(false);
            navigate("/dashboard");
        }, 2000);

    }
    return (
        <div className="content-area h-100vh p-3">
            {loading ? <ShowLoader /> : <HideLoader />}
            <div className='row align-items-center'>
                <div className='col-md-7 fontwhite'>
                    <h3 className='mb-0'>Your Properties !</h3>
                </div>
                <div className='col-md-3'>
                    <div className="position-relative">
                        <img src={Images.searchIcon} alt="search-icon" className="search-icon" />
                        <input
                            type="text"
                            className="form-control searchInput"
                            placeholder="Search here.."
                        />
                        {/* <img src={Images.filter} alt="search-icon" className="filter-icon cursor-pointer" title='Filter Properties' /> */}
                    </div>
                </div>
                <div className='col-md-2 text-end'>
                    <button type='button' className='WhiteBtn w-100' onClick={(e) => navigate('/add-property-scheme')}>
                        <img src={Images.blackaddicon} className='img-fluid pe-2' />Add Property
                    </button>
                </div>
            </div>
            {propertiesData?.commercial?.length > 0 && (
                <div className='row my-4'>
                    <h4 className='fontwhite'>Commercial</h4>
                    <div className="d-flex flex-wrap">
                        {propertiesData?.commercial?.map((item, index) => {
                            return <div className='col-md-3 m-2' key={index}>
                                <div className='card cursor-pointer property-card' style={{ background: '#303260', height: "100%" }} onClick={(e) => getCardClick(item)}>
                                    <div className='col-12 img-container' >
                                        <img src={item.property_img || Images.dummy_property} className='img-fluid' style={{ borderTopLeftRadius: "7px", borderBottomLeftRadius: "7px" }} />
                                    </div>
                                    <div className='row fontwhite px-2 py-2 align-items-baseline'>
                                        <label className='col-4 fw-bold'>Project</label>
                                        <label className='col-8 font-13'>: {item.name}</label>
                                    </div>
                                    <div className='row fontwhite px-2 pb-2 align-items-baseline'>
                                        <label className='col-4 pe-0 fw-bold'>Location</label>
                                        <label className='col-8 font-13'>: {item?.city}</label>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            )}
            {propertiesData?.residential?.length > 0 && (
                <div className='row my-4'>
                    <h4 className='fontwhite'>Residential</h4>
                    {propertiesData?.residential?.map((item, index) => {
                        return <div className='col-md-3' key={index}>
                            <div className='card cursor-pointer' style={{ background: '#303260' }} onClick={(e) => getCardClick(item)}>
                                <div className='col-12'>
                                    <img src={item.property_img || Images.dummy_property} className='img-fluid' style={{ borderTopLeftRadius: "7px", borderBottomLeftRadius: "7px" }} />
                                </div>
                                <div className='row fontwhite px-2 py-2 align-items-baseline'>
                                    <label className='col-4 fw-bold'>Project</label>
                                    <label className='col-8 font-13'>: {item.name}</label>
                                </div>
                                <div className='row fontwhite px-2 align-items-baseline'>
                                    <label className='col-4 pe-0 fw-bold'>Location</label>
                                    <label className='col-8 font-13'>: {item.address}</label>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            )}

        </div>
    )
}
