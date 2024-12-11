import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import PricingFeatures from '../../json/PricingFeatures.json'

export default function Pricing() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(1);
    const [plans, setPlans] = useState([]);
    const moduleid = location.state?.moduleid;
    useEffect(() => {
        const selectedModule = PricingFeatures.find(module => module.module_id == moduleid);
        setPlans(selectedModule ? selectedModule.plandetails : []);
    }, [moduleid]);
    const renderFeatures = (features) => (
        <ul>
            {features.map((feature, index) => (
                <li key={index} className="custom-icon font-14">{feature.data}</li>
            ))}
        </ul>
    );
    const renderPlan = (index, label, price, features) => (
        <div key={index} className={`col-md-3 pe-0 ${index == 1 ? 'standard_plan' : ''}`}>
            <div className='price_boxes font-15'>
                <div className='row'>
                    <div className='col-9'>
                        <label className='col-12 fw-medium'>{label}</label>
                        <label className='pt-2 fw-semibold font-20'>{price}</label>
                        {index != 0 &&
                            <small className='color-D8DADCE5'>month</small>
                        }
                    </div>
                    {index == 1 && (
                        <div className='col-3 ps-0'>
                            <label className='active_tab py-1 px-2 font-10 fw-semibold fontwhite'>Popular</label>
                        </div>
                    )}
                </div>
                <div className='col-12 text-center pt-4 pb-3'>
                    <button className='WhiteBtn w-100' type='button'>Select Plan</button>
                </div>
                <div className='col-12 pt-4'>
                    <label className='pb-3'>{features}</label>
                    {plans.length && (
                        renderFeatures(plans[index].features)
                    )}
                </div>
            </div>
        </div>
    );
    return (
        <div className='fontwhite'>
            <div className='col-12 text-center pt-2'>
                <h3>Sales Module Pricing Plans</h3>
                <small className='color-D8DADCE5'>
                    Our pricing plans are design to be affordable, flexible, and tailored to your unique needs.
                </small>
            </div>
            <div className='row pt-4 pb-3 justify-content-center'>
                <div className='col-md-2 row text-center align-items-center tab_bg p-0'>
                    <div className={`col-6 ${activeTab == 1 && "active_tab"} cursor-pointer`}
                        onClick={(e) => { setActiveTab(1) }}>Monthly</div>
                    <div className={`col-6 ${activeTab == 2 && "active_tab"} cursor-pointer`}
                        onClick={(e) => { setActiveTab(2); }}>Annually</div>
                </div>
            </div>
            <div className='col-12 text-end pb-3'>
                <label className='colorAAB8FF text-decoration-underline cursor-pointer'>Compare All Features ?</label>
            </div>
            <div className='row'>
                {renderPlan(0, 'Basic', 'Free', 'Features :')}
                {renderPlan(1, 'Standard', '₹ 2900/', 'Everything in Basic, Plus :')}
                {renderPlan(2, 'Premium', '₹ 1000/', 'Everything in Standard, Plus :')}
                {renderPlan(3, 'Enterprise', '₹ 1500/', 'Everything in Premium, Plus :')}
                <div className='col-12 text-center pt-2'>
                    <small className='color-D8DADCE5'>Anything beyond above mentioned limits can be customized for a specific client and pricing can be defined based on that.</small>
                </div>
            </div>
        </div>
    )
}
