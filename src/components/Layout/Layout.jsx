import React from 'react'
import { Outlet } from 'react-router-dom'
import TopMenu from './TopMenu'
import '../../styles/sideTopMenu.css'
import SideMenu from './SideMenu'

export default function Layout() {
    return (
        <div className='layout-container'>
            {/* Sidebar */}
            <aside className='sidemenu-container'>
                <SideMenu />
            </aside>

            <div className="main-layout-content">
                {/* Top Menu */}
                <header className="topmenu-container">
                    <TopMenu />
                </header>

                {/* Main content area */}
                <main className="content-area">
                    <Outlet />
                </main>
            </div>

        </div>
    )
}
