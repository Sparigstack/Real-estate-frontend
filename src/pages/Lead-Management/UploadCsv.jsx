import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react'
import Loader from '../../components/loader/Loader';
import useProperty from '../../hooks/useProperty';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import { useNavigate } from 'react-router-dom';

export default function UploadCsv({ setGridFlag }) {
    const { propertyId } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [filename, setFilename] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const handleButtonClick = () => fileInputRef.current?.click();
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setFilename(file.name);
        setFile(file);
    };
    const handleFileUpload = async () => {
        setLoading(true);
        try {
            var formdata = new FormData();
            formdata.append("file", file);
            formdata.append("propertyid", propertyId);
            const result = await postAPIAuthKey('/add-leads-csv', formdata, true);
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
    }
    return (
        <>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => setGridFlag(2)}>All Leads /</label> Upload CSV</div>
                </div>
            </div>
            <div className='text-center'>

                <div className='p-5 fontwhite'>
                    <p>
                        To ensure data accuracy, please download our CSV template file and ensure that your column headings match the template before importing your leads into the system.
                    </p>
                    <p>
                        <a className='fontwhite fw-semibold cursor-pointer text-decoration-none' href="/csv/lead_csv.csv" download="Lead.csv">
                            CLICK HERE
                        </a> to download the template CSV file for leads data. Use this template to prepare your CSV file. Once your file is ready, browse for the file on your computer and click the upload button to import the data into your account.
                    </p>
                    <button className='text-center WhiteBtn ms-3' style={{ border: "1px solid black" }}
                        onClick={handleButtonClick}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="ms-3 cursor-pointer"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <FontAwesomeIcon icon={faFileImport} className='pe-2' />
                        Import Lead CSV
                    </button>
                    {filename &&
                        <p className='pt-4'>
                            {filename}
                            <br />
                            <button className='text-center WhiteBtn mt-2' onClick={handleFileUpload}>
                                Upload CSV
                            </button>
                        </p>
                    }
                </div>

            </div>
        </>
    )
}
