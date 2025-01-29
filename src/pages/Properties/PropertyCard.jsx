import React from 'react'

export default function PropertyCard(props) {
    return (
        <div className='pb-2 px-1'>
            <div className='card cursor-pointer property-card' style={{ background: '#303260', height: "100%" }}
                onClick={(e) => props.cardclick()}>
                <div className='col-12 img-container' >
                    <img src={props.img} className='img-fluid' style={{ borderRadius: "7px" }} />
                </div>
                <div className='row fontwhite px-2 pt-2 align-items-baseline'>
                    <label className='col-12 mb-1 font-12 fw-bold'>{props.name}</label>
                    <label className='col-12 font-10 mb-1 ' style={{ color: "#d3cdcd" }}>{props?.area}, {props?.city}</label>
                </div>
            </div>
        </div>
    )
}
