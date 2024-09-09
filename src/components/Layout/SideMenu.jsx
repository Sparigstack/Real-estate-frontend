import React from 'react'
import Images from '../../utils/Images'
import { NavLink } from 'react-router-dom'
import '../../styles/sideTopMenu.css'
export default function SideMenu() {
    return (
        <div className='side-menu'>
            <div className='px-4 pt-3 pb-4'>
                <img src={Images.realEstateLogo} alt="logo" />
            </div>
            <ul className="nav nav-pills flex-column p-2 pt-4">
                <li className="nav-item">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.dashboardIcon} className='me-2' alt="dashboard-icon" />Dashboard</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.propertyIcon} className='me-2' alt="property-icon" />Property</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.livingStyle} className='me-2' alt="living-style" />Living Style</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.educationalGuideline} className='me-2' alt="educational-guideline" />Educational Guideline</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.architecturalSketches} className='me-2' alt="architectural-styles" />Architectural Sketches</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.task} className='me-2' alt="task" />Task</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.files} className='me-2' alt="files" />Files</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.financialInsights} className='me-2' alt="financial-insights" />Financial Insights</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.settings} className='me-2' alt="settings" />Settings</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/feature" className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'}><img src={Images.account} className='me-2' alt="account" />Account</NavLink>
                </li>
            </ul>
        </div>
    )
}
