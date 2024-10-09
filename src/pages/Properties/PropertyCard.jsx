import React from 'react'

export default function PropertyCard(props) {
    return (
        <div className='col-md-3 py-2 pe-2'>
            <div className='card cursor-pointer property-card' style={{ background: '#303260', height: "100%" }}
                onClick={(e) => props.cardclick()}>
                <div className='col-12 img-container' >
                    <img src={props.img} className='img-fluid' style={{ borderTopLeftRadius: "7px", borderBottomLeftRadius: "7px" }} />
                </div>
                <div className='row fontwhite px-2 pt-2 align-items-baseline'>
                    <h5 className='col-8 fw-bold'>{props.name}</h5>
                </div>
                <div className='row fontwhite px-2 pb-2 align-items-baseline'>
                    <label className='col-8 font-13'>{props?.area}, {props?.city}</label>
                </div>
            </div>
        </div>
    )
}
