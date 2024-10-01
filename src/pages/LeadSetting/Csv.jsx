import React, { useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import HideLoader from '../../components/loader/HideLoader';
import Cookies from 'js-cookie';
import AlertComp from '../../components/AlertComp';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';

export default function Csv() {
    const fileInputRef = useRef(null);
    const handleButtonClick = () => fileInputRef.current?.click();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const token = Cookies.get('authToken');
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Authorization", `Bearer ${token}`);
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setLoading(true);
        var formdata = new FormData();
        formdata.append("file", file);
        const requestOptions = { method: "POST", headers, body: formdata };
        try {
            const response = await fetch(`${BASE_URL}/add-leads-csv`, requestOptions);
            const result = await response.text();
            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == "success") {
                setShowAlerts(<AlertComp show={true} variant="success" message={'CSV imported Successfully'} />);
                setTimeout(() => {
                    setShowAlerts(<AlertComp show={false} />);
                    navigate('/lead-management');
                }, 1500);
            } else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => setShowAlerts(<AlertComp show={false} />), 2000);
            }
        } catch (error) {
            setLoading(false);
            console.log('error', error);
        }
    };
    return (
        <div>
            {showAlerts}
            {loading ? <ShowLoader /> : <HideLoader />}
            <button className='WhiteBtn ms-3' style={{ border: "1px solid black" }} onClick={handleButtonClick}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="ms-3 cursor-pointer"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <FontAwesomeIcon icon={faFileImport} className='pe-2' />
                Upload CSV
            </button>
        </div>
    )
}
