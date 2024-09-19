import React from 'react'
import { Outlet } from 'react-router-dom'
import TopMenu from './TopMenu'
import Images from '../../utils/Images'
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

            {/* Help and Chatbot section */}
            {/* <div className='help-chatbot-container'>
                <div className='chatbot-inner'>
                    <img src={Images.help} alt="help" className='help-image' />
                    <img src={Images.chatbot} alt="chatbot" className='cursor-pointer chatbot-image' />
                </div>
            </div> */}
        </div>
    )
}
