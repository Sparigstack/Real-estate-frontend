import React, { useRef, useState } from 'react'
import AlertComp from '../../components/alerts/AlertComp';
import { useNavigate } from 'react-router-dom';
import useApiService from '../../hooks/useApiService';
import Loader from '../../components/loader/Loader';
import LoadingBar from 'react-top-loading-bar';
import useProperty from '../../hooks/useProperty';
import Images from '../../utils/Images';

export default function Csv() {
    const { postAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const fileInputRef = useRef(null);
    const loadingBarRef = useRef(null);
    const handleButtonClick = () => fileInputRef.current?.click();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [filename, setFilename] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setFilename(file.name);
        setFile(file);
    };
    const handleFileUpload = async () => {
        const loaderRef = loadingBarRef.current
        if (loaderRef) {
            loaderRef.continuousStart();
        }
        try {
            var formdata = new FormData();
            formdata.append("file", file);
            formdata.append("propertyid", schemeId);
            const result = await postAPIAuthKey('/add-leads-csv', formdata, true);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == "success") {
                setShowAlerts(<AlertComp show={true} variant="success" message={'File imported Successfully'} />);
                setTimeout(() => {
                    setShowAlerts(false);
                    navigate('/all-leads')
                }, 1500);
            } else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => setShowAlerts(false), 2000);
            }
        } catch (error) {
            setLoading(false);
            console.log('error', error);
        } finally {
            if (loaderRef) {
                loaderRef.complete();
            }
        }
    }
    return (
        <div>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='font-14'>
                <p>
                    To ensure data accuracy, please download our CSV template file and ensure that your column headings match the template before importing your leads into the system.
                </p>
                <p className='p-0 m-0'>
                    <a className='fw-semibold fontwhite cursor-pointer ' href="/csv/lead_csv.csv" download="Lead.csv">
                        <i> CLICK HERE</i>
                    </a> to download the template CSV file for leads data. Use this template to prepare your CSV/Excel file. Once your file is ready, browse for the file on your computer and click the upload button to import the data into your account.
                </p>
            </div>
            <div className="text-center mt-4">
                <button className='text-center borderBtn ms-3 px-5'
                    onClick={handleButtonClick}>
                    <input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileChange}
                        className="ms-3 cursor-pointer"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <img src={Images.importicon} className='pe-2 iconsize' />
                    Import Lead CSV/Excel
                </button>
                <div className='py-3 px-5'>
                    <LoadingBar style={{ borderRadius: "6px" }}
                        ref={loadingBarRef}
                        containerClassName='progressbarClass CustomProgressbar' />
                </div>
                {filename &&
                    <p className='pt-4 fontwhite font-13'>
                        {filename}
                        <br />

                        <button className='text-center WhiteBtn mt-2' onClick={handleFileUpload}>
                            Upload File
                        </button>
                    </p>
                }
            </div>
        </div>
    )
}
