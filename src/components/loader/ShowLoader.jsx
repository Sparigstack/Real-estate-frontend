import React from 'react'
import '../../styles/loader.css'

export default function ShowLoader() {
    return (
        <>
            <div className="loader">
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
                <div className="loader-square"></div>
            </div>
            <div className="Overlay" style={{ display: "block" }}></div>
        </>
    )
}
