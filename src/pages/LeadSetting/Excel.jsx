import React, { useRef, useState } from 'react'
import AlertComp from '../../components/alerts/AlertComp';
import { useNavigate } from 'react-router-dom';
import useApiService from '../../hooks/useApiService';
import Loader from '../../components/loader/Loader';
import LoadingBar from 'react-top-loading-bar';
import useProperty from '../../hooks/useProperty';
import Images from '../../utils/Images';
import Cookies from 'js-cookie';
import UpgradePlanPopup from '../../components/UpgradePlan/UpgradePlanPopup';

export default function Excel() {
    const { postAPIAuthKey, getAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const userid = Cookies.get('userId');
    const fileInputRef = useRef(null);
    const loadingBarRef = useRef(null);
    const handleButtonClick = () => fileInputRef.current?.click();
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [filename, setFilename] = useState('');
    const [file, setFile] = useState(null);
    const [CsvDataForLeads, setCsvDataForLeads] = useState([]);
    const [PlanPopup, setPlanPopup] = useState(false);
    const [divVisibleForExport, setdivVisibleForExport] = useState(false);
    const [planResponse, setPlanResponse] = useState({
        moduleid: "",
        planname: "",
        previousPath: location.pathname
    })
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
            formdata.append("userId", userid);
            formdata.append("userCapabilities", 'manual_entry_csv_import');
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
            }
            else if (responseRs.status == "upgradeplan") {
                setPlanResponse({ ...planResponse, moduleid: responseRs.moduleid, planname: responseRs.activeplanname });
                setPlanPopup(true);
            }
            else {
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
    const getExportLead = async () => {
        setLoading(true);
        try {
            const result = await getAPIAuthKey(`/exportLeads/${schemeId}?userCapabilities=excel_import_export&flag=2`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setLoading(false);
            if (responseRs.status == "success") {
                setCsvDataForLeads(responseRs.data);
                setdivVisibleForExport(true)
            }
            else if (responseRs.status == "upgradeplan") {
                setPlanResponse({ ...planResponse, moduleid: responseRs.moduleid, planname: responseRs.activeplanname });
                setPlanPopup(true);
            }

        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handleExportCsv = () => {
        const csvContent = [];
        const leadsmap = [];
        CsvDataForLeads?.forEach((data) => {
            const rowData = {
                'Name': data?.name,
                'Email': data?.email,
                'Contact': data?.contact_no,
                'Source': data?.lead_source?.name,
                'Status': data?.lead_status?.name,
                'Notes': data?.notes,
                'Address': data?.address,
                'State': data?.state?.name,
                'City': data?.city?.name,
                'Pincode': data?.pincode,
            };
            leadsmap.push(rowData);
        });

        if (leadsmap.length > 0) {
            const headers = ['Name', 'Email', 'Contact', 'Source', 'Status', 'Notes', 'Address', 'State', 'City', 'Pincode'];
            csvContent.push(headers);
            leadsmap.forEach((rowData) => {
                const values = headers.map(header => rowData[header] || ''); // Ensure each column corresponds to the header
                csvContent.push(values);
            });
            csvContent.push([]);
            const csvString = csvContent.map((row) => row.join(',')).join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'leads.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            RemoveLeadsCsv();
        } else {
            console.log('No data available for download.');
        }
    };
    function RemoveLeadsCsv() {
        setCsvDataForLeads([]);
        setdivVisibleForExport(false);
    }
    return (
        <>

            <div className='col-md-6 mt-3 ps-0' >
                {showAlerts}
                {loading && <Loader runningcheck={loading} />}
                <div className='square-boxes' style={{ height: "100%" }}>
                    <div className='col-12 fw-semibold square-boxes-header'>
                        Import/Export Excel
                    </div>
                    <div className='square-boxes-body'>
                        <div className='font-14 fontwhite'>
                            <p>
                                To ensure data accuracy, please download our EXCEL template file and ensure that your column headings match the template before importing your leads into the system.
                            </p>
                            <p className='p-0 m-0'>
                                <a className='fw-semibold fontwhite cursor-pointer ' href="/csv/lead_excel.xlsx" download="Lead.xlsx">
                                    <i> CLICK HERE</i>
                                </a> to download the template EXCEL file for leads data. Use this template to prepare your EXCEL file. Once your file is ready, browse for the file on your computer and click the upload button to import the data into your account.
                            </p>
                        </div>
                        <div className="text-center row mt-4 p-2">
                            <button className='col-md-5 offset-md-1 text-center me-3 borderBtn mt-2 px-3'
                                onClick={handleButtonClick}>
                                <input
                                    type="file"
                                    accept=".xlsx"
                                    onChange={handleFileChange}
                                    className="ms-3 cursor-pointer"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                />
                                <img src={Images.importicon} className='me-2 pe-1 iconsize' />
                                Import Lead Excel
                            </button>
                            <button className='col-md-5 text-center borderBtn mt-2 px-3'
                                onClick={getExportLead}>
                                <img src={Images.exporticon} className='me-2 pe-1 iconsize' />
                                Export Lead Excel
                            </button>
                            {divVisibleForExport &&
                                <div className="row pt-5 fontwhite">
                                    <div>Your Leads Excel file is now ready for download. Please click the button below to initiate the file download.</div>
                                    <div className="col-12 mt-3 text-center">
                                        <label className=''>
                                            Leads.xlsx
                                        </label>
                                        <img src={Images.white_cancel} className="cursor-pointer ps-3" onClick={RemoveLeadsCsv} />
                                        <br />
                                        <button className='WhiteBtn WhiteFont mt-3' onClick={handleExportCsv}>Download</button>
                                    </div>
                                </div>
                            }
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
                </div>
            </div>

            {PlanPopup && <UpgradePlanPopup show={PlanPopup} onHide={() => setPlanPopup(false)}
                data={planResponse} />}
        </>
    )
}
