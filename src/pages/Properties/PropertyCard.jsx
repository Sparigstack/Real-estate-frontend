import React from 'react'

export default function PropertyCard(props) {
    return (
        <div className='col-md-3 p-2'>
            <div className='card cursor-pointer property-card' style={{ background: '#303260', height: "100%" }}
                onClick={(e) => props.cardclick()}>
                <div className='col-12 img-container' >
                    <img src={props.img} className='img-fluid' style={{ borderTopLeftRadius: "7px", borderBottomLeftRadius: "7px" }} />
                </div>
                <div className='row fontwhite px-2 py-2 align-items-baseline'>
                    <label className='col-4 fw-bold'>Project</label>
                    <label className='col-8 font-13'>: {props.name}</label>
                </div>
                <div className='row fontwhite px-2 pb-2 align-items-baseline'>
                    <label className='col-4 pe-0 fw-bold'>Location</label>
                    <label className='col-8 font-13'>: {props?.area}, {props?.city}</label>
                </div>
            </div>
        </div>
    )
}
