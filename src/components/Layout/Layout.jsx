import React from 'react'
import SideMenu from './Sidemenu'
import { Outlet } from 'react-router-dom'
import TopMenu from './TopMenu'
import Images from '../../utils/Images'
import '../../styles/sideTopMenu.css'

export default function Layout() {
    return (
        <div className='layout-container' style={{ background: '#03053D' }}>
                <div className="min-vh-100 sidemenu-container" style={{ background: '#303260' }}>
                    <SideMenu />
                </div>
                <div className="p-0" style={{marginLeft:'260px'}}>
                    <TopMenu />
                    <div className="main-content" style={{ background: `url(${Images.phoneAndOtpBackground})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', minHeight:'100vh' }}>
                        <Outlet />
                    </div>
                    <div className='helpAndChatbot d-flex align-items-center'>
                        <div className='position-relative chatbot-container'>
                        <img src={Images.help} alt="help" className='help-image'/>
                        <img src={Images.chatbot} alt="chatbot" style={{height:'50px'}} className='cursor-pointer'/>
                        </div>
                    </div>
                </div>
        </div>
    )
}
