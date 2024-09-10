import React from 'react'
import Images from '../../utils/Images'
import { NavLink } from 'react-router-dom'
import '../../styles/sideTopMenu.css'
import SideMenuItems from '../../json/SideMenuItems.json'
import { Dropdown } from 'react-bootstrap'

export default function SideMenu() {
    return (
        <div className='side-menu'>
            <div className='px-4 pt-3 pb-4'>
                <img src={Images.realEstateLogo} alt="logo" />
            </div>
            <ul className="nav nav-pills flex-column p-2 pt-4">
                {SideMenuItems.map((item, index) => (
                    <li className="nav-item d-flex align-items-center pb-2" key={index}>
                        {item.label == 'Property' ? (
                            <Dropdown className='custom-dropdown'>
                                <Dropdown.Toggle
                                    variant="link"
                                    id={`dropdownMenuButton${index}`}
                                    className="text-white fw-light text-decoration-none d-flex align-items-center">
                                    <img src={Images[item.imageKey]} className="me-3" alt={item.altText} />
                                    {item.label}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={NavLink} to="/property/submenu1">
                                        Submenu 1
                                    </Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/property/submenu2">
                                        Submenu 2
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <NavLink to={item.path} className={({ isActive }) => isActive ? 'nav-link active text-white fw-bold' : 'nav-link text-white fw-light'} style={{fontSize:'16px'}}><img src={Images[item.imageKey]} className={`me-2`} alt={item.altText} />{item.label}</NavLink>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
