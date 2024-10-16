import React, { useRef, useState } from 'react'
import Loader from '../../components/loader/Loader';
import useProperty from '../../hooks/useProperty';
import useApiService from '../../hooks/useApiService';
import AlertComp from '../../components/alerts/AlertComp';
import LoadingBar from 'react-top-loading-bar';
import Images from '../../utils/Images';
import { useNavigate } from 'react-router-dom';

export default function UploadCsv() {
    const navigate = useNavigate();
    const { schemeId } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [filename, setFilename] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const fileInputRef = useRef(null);
    const loadingBarRef = useRef(null);
    const handleButtonClick = () => fileInputRef.current?.click();
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
                setShowAlerts(<AlertComp show={true} variant="success" message={'CSV imported Successfully'} />);
                setTimeout(() => {
                    setShowAlerts(null);
                    navigate('/all-leads');
                }, 2000);
            } else {
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => setShowAlerts(<AlertComp show={false} />), 2000);
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
        <>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => navigate('/all-leads')}>All Leads /</label> Upload CSV</div>
                </div>
            </div>
            <div style={{ textAlign: "justify", border: "1px solid #484155" }} className='px-5 m-3'>
                <div className='p-5 fontwhite'>
                    <p>
                        To ensure data accuracy, please download our CSV template file and ensure that your column headings match the template before importing your leads into the system.
                    </p>
                    <p className='p-0 m-0'>
                        <a className='fontwhite fw-semibold cursor-pointer ' href="/csv/lead_csv.csv" download="Lead.csv">
                            <i> CLICK HERE</i>
                        </a> to download the template CSV file for leads data. Use this template to prepare your CSV file. Once your file is ready, browse for the file on your computer and click the upload button to import the data into your account.
                    </p>
                </div>
                <div className='text-center'>
                    <button className='text-center borderBtn ms-3 px-5'
                        onClick={handleButtonClick}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="ms-3 cursor-pointer"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <img src={Images.importicon} className='pe-2 iconsize' />
                        Import Lead CSV
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
                                Upload CSV
                            </button>
                        </p>
                    }
                </div>
            </div>

        </>
    )
}
