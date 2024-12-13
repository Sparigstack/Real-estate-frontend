import React from 'react'
import { formatCurrency } from '../../utils/js/Common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'

export default function LeadInformationPopup({ LeadInfoData }) {
    return (
        <div className='px-0 pb-4 row font-13 formLabel'>
            <div className='col-md-12 mb-3'>
                <div className='fw-bold font-14'>Lead Details</div>
                <div className='white_boxes mt-2 '>
                    <div className='row'>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Name</label>
                            <label>: &nbsp; {LeadInfoData?.name}</label>
                        </div>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Contact No.</label>
                            <label>: &nbsp; {LeadInfoData?.contact_no}</label>
                        </div>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Source</label>
                            <label>: {LeadInfoData?.source_name}</label>
                        </div>
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Status</label>
                            <label>: {LeadInfoData?.status_name}</label>
                        </div>
                        {LeadInfoData?.source_name == "Agent" && (
                            <>
                                <div className='col-md-6 pb-2'>
                                    <label className='fw-semibold'>Agent Name</label>
                                    <label>: {LeadInfoData?.agent_name || '-'}</label>
                                </div>
                                <div className='col-md-6 pb-2'>
                                    <label className='fw-semibold'>Agent Contact </label>
                                    <label>: {LeadInfoData?.agent_contact || '-'}</label>
                                </div>
                            </>
                        )}
                        <div className='col-md-6 pb-2'>
                            <label className='fw-semibold'>Email</label>
                            <label>: &nbsp; {LeadInfoData?.email || '-'}</label>
                        </div>
                        <div className='col-md-12'>
                            <label className='fw-semibold'>Notes</label>
                            <label>: &nbsp; {LeadInfoData?.notes || '-'}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <div className='fw-bold font-14'>Intersted Units</div>
                <div className='white_boxes mt-2 '>
                    {LeadInfoData?.interested_units?.length ?
                        LeadInfoData?.interested_units?.map((item, index) => {
                            return <div className='row' key={index}>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Unit</label>
                                    <label>: &nbsp; {item.wing_name}{item.wing_name && '-'}{item.unit_name}</label>
                                </div>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Budget</label>
                                    <label>: &nbsp; {item.budget ? formatCurrency(item.budget) : 0} <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1 font-13' /></label>
                                </div>
                            </div>
                        })
                        :
                        <div className='col-12 text-center'>
                            No Data Found
                        </div>
                    }
                </div>
            </div>
            <div className='col-md-6'>
                <div className='fw-bold font-14'>Booked Units</div>
                <div className='white_boxes mt-2 '>
                    {LeadInfoData?.booked_units?.length ?
                        LeadInfoData?.booked_units?.map((item, index) => {
                            return <div className='row' key={index}>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Unit</label>
                                    <label>: &nbsp; {item.wing_name} - {item.unit_name}</label>
                                </div>
                                <div className='col-md-6'>
                                    <label className='fw-semibold'>Total Paid</label>
                                    <label>: &nbsp; {item.total_paid_amount} <FontAwesomeIcon icon={faIndianRupeeSign} className='ps-1 font-13' /></label>
                                </div>
                            </div>
                        })
                        :
                        <div className='col-12 text-center'>
                            No Data Found
                        </div>
                    }
                </div>
            </div>
        </div >
    )
}
