import React from 'react'
import { Outlet } from 'react-router-dom'
import TopMenu from './TopMenu'
import SideMenu from './SideMenu'
import { PropertyProvider } from '../../context/PropertyContext'
export default function Layout() {
    return (
        <PropertyProvider>
            <div className='layout-container'>
                <aside className='sidemenu-container'>
                    <SideMenu />
                </aside>

                <div className="main-layout-content">
                    <header className="topmenu-container">
                        <TopMenu />
                    </header>
                    <main className="content-area">
                        <Outlet />
                    </main>
                </div>

            </div>
        </PropertyProvider>
    )
}
