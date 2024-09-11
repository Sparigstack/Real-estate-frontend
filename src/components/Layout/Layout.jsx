import React from 'react'
import SideMenu from './Sidemenu'
import { Outlet } from 'react-router-dom'
import TopMenu from './TopMenu'

export default function Layout() {
    return (
        <div className='layout-container' style={{ background: '#03053D' }}>
            <div className="row">
                <div className="col-md-2 min-vh-100 pe-0" style={{ background: '#303260' }}>
                    <SideMenu />
                </div>
                <div className="col-md-10 p-0">
                    <TopMenu />
                    <div className="main-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
