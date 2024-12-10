import React from 'react'

export default function Pricing() {
    return (
        <div className='fontwhite'>
            <div className='col-12 text-center p-5'>
                <h1>Pricing Plans</h1>
            </div>
            <div className='row'>
                <div className='col-md-4'>
                    <div className='price_boxes h-100'>
                        <div className='col-12'>
                            <b>Basic + Free</b>
                        </div>
                        <div className='col-12'>
                            <ul>
                                <li>Add Leads up to 500</li>
                                <li>CSV Import</li>
                                <li>Tags & Custom Fields</li>
                                <li>Basic Status Report</li>
                                <li>CSV Export</li>
                                <li>1 User</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='price_boxes h-100'>
                        <div className='col-12'>
                            <b>Standard</b>
                        </div>
                        <div className='col-12'>
                            <ul>
                                <li>Add Leads up to 2500</li>
                                <li>Search by Tags & Custom Fields</li>
                                <li>CSV/Excel import/export</li>
                                <li>Standard Status Report</li>
                                <li>Up to 500 Whatsapp Notification</li>
                                <li>Reminders Setup</li>
                                <li>On Screen Notifications</li>
                                <li>Up to 5 Users</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='price_boxes h-100'>
                        <div className='col-12'>
                            <b>Premium</b>
                        </div>
                        <div className='col-12'>
                            <ul>
                                <li>Unlimited Leads</li>
                                <li>Advance Reports & Lead scoring AI</li>
                                <li>Up to 2000 Whatsapp Notification</li>
                                <li>Daily Reminders Snapshot</li>
                                <li>Up to 10 Users</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
