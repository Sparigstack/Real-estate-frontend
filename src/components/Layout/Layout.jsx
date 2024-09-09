import React from 'react'
import SideMenu from './Sidemenu'
import TopMenu from './Topmenu'
import { Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className='layout-container' style={{ background: '#03053D' }}>
            <div className="row">
                <div className="col-md-2 min-vh-100 pe-0" style={{ background: '#303260' }}>
                    <SideMenu />
                </div>
                <div className="col-md-10">
                    <TopMenu />
                    <div className="main-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
