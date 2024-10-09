import React, { useRef, useState } from 'react'
import ShowLoader from '../../components/loader/ShowLoader';
import AlertComp from '../../components/alerts/AlertComp';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import useApiService from '../../hooks/useApiService';

export default function Csv() {
    const { postAPIAuthKey } = useApiService();
    const fileInputRef = useRef(null);
    const handleButtonClick = () => fileInputRef.current?.click();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const navigate = useNavigate();
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            var formdata = new FormData();
            formdata.append("file", file);
            const result = await postAPIAuthKey('/add-leads-csv', formdata);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
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
            {loading && <ShowLoader />}
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
