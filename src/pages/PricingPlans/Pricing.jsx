import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import useApiService from '../../hooks/useApiService';
import Cookies from 'js-cookie';
import Images from '../../utils/Images';
import useProperty from '../../hooks/useProperty';
import AlertComp from '../../components/alerts/AlertComp';

export default function Pricing() {
    const location = useLocation();
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const userId = Cookies.get('userId');
    const moduleid = location.state?.moduleid;
    const { schemeId } = useProperty();

    const [loading, setLoading] = useState(false);
    const [alerts, setShowAlerts] = useState(false);
    const [activeTab, setActiveTab] = useState(1);
    const [PricingData, setPricingData] = useState('');
    const [SelectedPlanid, setSelectedPlanid] = useState('');
    const [allFeatures, setAllFeatures] = useState([]);
    const compareFeatureRef = useRef(null);
    useEffect(() => {
        getModulePlanDetail();
    }, [moduleid]);
    const getModulePlanDetail = async () => {
        setLoading(true);
        try {
            const result = await getAPIAuthKey(`/get-module-plan-details/${userId}/${moduleid}`);
            const responseRs = JSON.parse(result)
            if (result) {
                setPricingData(responseRs);
                setAllFeatures(responseRs?.featuredetails)
            } else {
                alert('Something went wrong');
            }
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    const handleCompareFeaturesClick = () => {
        compareFeatureRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleSelectPlan = async (planid) => {
        setSelectedPlanid(planid);
        var raw = JSON.stringify({
            moduleId: moduleid,
            planId: planid,
            mothly_yearly: activeTab,
            userId: parseInt(userId)
        });
        const result = await postAPIAuthKey('/add-user-module-plan', raw);

        if (!result) {
            throw new Error('Something went wrong');
        }

        const responseRs = JSON.parse(result);
        setLoading(false);
        if (responseRs.status == 'success') {
            setShowAlerts(<AlertComp show={true} variant="success" message={'Plan Selected!'} />);
            setTimeout(() => {
                setShowAlerts(false);
                getModulePlanDetail();
            }, 2000);
        }
        else {
            setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
            setTimeout(() => {
                setShowAlerts(false);
            }, 5000);
        }
    }
    return (
        <>
            {loading && <Loader runningcheck={loading} />}
            {alerts}
            <div className='fontwhite'>
                {/* Module Pricing Plans */}
                <>
                    <div className='col-12 text-center pt-2'>
                        <h4 className='fw-semibold'>{PricingData.module_name} Module Pricing Plans</h4>
                        <small className='color-D8DADCE5'>
                            Our pricing plans are design to be affordable, flexible, and tailored to your unique needs.
                        </small>
                    </div>
                    <div className='row pt-4 pb-3 justify-content-center'>
                        <div className='col-md-2 row text-center align-items-center tab_bg p-1'>
                            <div className={`col-6 ${activeTab == 1 && "active_tab"} cursor-pointer`}
                                onClick={(e) => { setActiveTab(1) }}>Monthly</div>
                            <div className={`col-6 ${activeTab == 2 && "active_tab"} cursor-pointer`}
                                onClick={(e) => { setActiveTab(2); }}>Annually</div>
                        </div>
                    </div>
                    <div className='text-end'>
                        <label className='colorAAB8FF pe-3 pb-3 font-13 text-decoration-underline cursor-pointer'
                            onClick={handleCompareFeaturesClick}>Compare All Features ?</label>
                    </div>
                    <div className='row pe-3 ps-1 pb-5'>
                        {PricingData.plandetails?.length > 0 &&
                            PricingData.plandetails?.map((item, index) => {
                                return <div key={index} className={`col-md-3 pe-0 `}>
                                    <div className={`price_boxes font-15 ${item.name == "Standard" ? 'standard_plan' : ''}`}>
                                        <div className='row'>
                                            <div className={`col-9`}>
                                                <label className='col-12 font-14 fw-medium'>{item.name}</label>
                                            </div>
                                            {item.name == "Standard" && item.id != PricingData.active_plan_id && (
                                                <div className='col-3 ps-0 pe-5'>
                                                    <label className='active_tab py-1 px-2 font-10 fw-semibold fontwhite'>Popular</label>
                                                </div>
                                            )}
                                            {item.id == PricingData.active_plan_id &&
                                                <div className='col-3 text-end pe-3'>
                                                    <img src={Images.active_plan} className='iconsize' />
                                                </div>
                                            }
                                            <div className='col-12'>
                                                <label className='pt-2 fw-semibold font-18'>
                                                    {item.name == "Basic" ?
                                                        <label>Free</label> :
                                                        <label>
                                                            ₹ {activeTab == 1 ? item.monthly_price : item.yearly_price}/
                                                        </label>
                                                    }
                                                </label>
                                                {item.name != "Basic" &&
                                                    <small className='color-D8DADCE5'>
                                                        {activeTab == 1 ? ' month' : ' annually(10% off)'}
                                                    </small>
                                                }
                                            </div>
                                        </div>
                                        <div className='col-12 text-center pt-4 pb-3'>
                                            {item.id == PricingData.active_plan_id ?
                                                <button className='ActivePlanBtn w-100 font-12' type='button'>Active Plan</button>
                                                :
                                                <button className='WhiteBtn w-100 font-12' type='button'
                                                    onClick={(e) => { handleSelectPlan(item.id) }}>Select Plan</button>
                                            }
                                        </div>
                                        <div className='col-12 pt-4'>
                                            <label className='pb-3 font-13'>Features : </label>
                                            {item.features?.length && (
                                                <ul className='ps-3'>
                                                    {item.features?.map((feature, findex) => (
                                                        <li key={findex} className="custom-icon font-12">{feature.data}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            })}
                    </div>
                </>

                {/* Compare All Features */}
                <div className='row px-3'>
                    <div className='col-12 text-center pt-5' ref={compareFeatureRef}>
                        <h4 className='pt-4 fw-semibold'>Compare All Features</h4>
                    </div>
                    <div className='row pt-3 px-0'>
                        <div className='col-md-4'></div>
                        {PricingData.plandetails?.length > 0 &&
                            PricingData.plandetails?.map((item, index) => {
                                return <div className='col-md-2 pe-0 text-center' key={index}>
                                    <small className='color-D8DADCE5'>{item.name}</small>
                                    <br />
                                    <label>
                                        <label className='pt-2 fw-semibold font-18'>
                                            {item.name == "Basic" ?
                                                <label>Free</label> :
                                                <label>
                                                    ₹ {activeTab == 1 ? item.monthly_price : item.yearly_price}/
                                                </label>
                                            }
                                        </label>
                                        <label>
                                            {item.name != "Basic" &&
                                                <small className='color-D8DADCE5'>
                                                    &nbsp;{activeTab == 1 ? 'month' : 'annually'}
                                                </small>
                                            }
                                        </label>
                                    </label>
                                    <div className='col-12 text-center pt-2'>
                                        <button className='WhiteBtn w-100 font-12' type='button'
                                            onClick={(e) => { handleSelectPlan(item.id) }}>Select Plan
                                        </button>
                                    </div>
                                </div>
                            })}
                    </div>
                    <div className='pt-3 pb-2 ps-0 grid_brdr_btm'>
                        <label className='font-20'>All Features</label>
                    </div>
                    <div className='col-12 px-0 font-13'>
                        {allFeatures?.length &&
                            allFeatures.map((item, index) => {
                                return <div className='grid_brdr_btm py-3' key={index}>
                                    <div className='row px-0 color-D8DADCE5'>
                                        <div className='col-md-4'>
                                            {item.feature_description}
                                        </div>
                                        <div className='col-md-2 ps-0 text-center'>
                                            {item.Basic_plan == "" ?
                                                <label>-</label> :
                                                item.Basic_plan == "Included" ?
                                                    <label>✓</label>
                                                    :
                                                    item.Basic_plan
                                            }
                                        </div>
                                        <div className='col-md-2 ps-0 text-center'>
                                            {item.Standard_plan == "" ?
                                                <label>-</label> :
                                                item.Standard_plan == "Included" ?
                                                    <label>✓</label>
                                                    :
                                                    item.Standard_plan
                                            }
                                        </div>
                                        <div className='col-md-2 ps-0 text-center'>
                                            {item.Premium_plan == "" ?
                                                <label>-</label> :
                                                item.Premium_plan == "Included" ?
                                                    <label>✓</label>
                                                    :
                                                    item.Premium_plan
                                            }
                                        </div>
                                        <div className='col-md-2 ps-0 text-center'>
                                            {item.Enterprise_plan == "" ?
                                                <label>-</label> :
                                                item.Enterprise_plan == "Included" ?
                                                    <label>✓</label>
                                                    :
                                                    item.Enterprise_plan
                                            }
                                        </div>
                                    </div>
                                </div>
                            })}
                    </div>
                </div>
            </div>
        </>
    )
}
