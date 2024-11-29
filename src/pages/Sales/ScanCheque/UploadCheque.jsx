import React, { useRef, useState } from 'react'
import Images from '../../../utils/Images'
import useProperty from '../../../hooks/useProperty';
import useApiService from '../../../hooks/useApiService';
import AlertComp from '../../../components/alerts/AlertComp';
import { convertToBase64 } from '../../../utils/js/Common';

export default function UploadCheque({ setloading, setShowAlerts, setLeadData, leadData, setScanDiv, scanDiv }) {
    const fileInputRef = useRef(null);
    const [Filebase64, setFilebase64] = useState(null);
    const [file, setFile] = useState(null);
    const { schemeId } = useProperty();
    const { postAPIAuthKey } = useApiService();
    const [errorMsg, setErrorMsg] = useState(false);
    const [scanStart, setscanStart] = useState(false);
    const handleButtonClick = () => fileInputRef.current?.click();
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const base64 = await convertToBase64(file);
        setFilebase64(base64);
        setFile(file);
    };

    const handleFileUpload = async () => {
        setscanStart(true);
        try {
            var formdata = new FormData();
            formdata.append("image", file);
            formdata.append("propertyID", schemeId);
            const result = await postAPIAuthKey('/detect-cheque', formdata, true);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            if (responseRs.status == "success") {
                setscanStart(false);
                if (responseRs.matchedLeads.length == 0) {
                    setErrorMsg(true);
                }
                const transformedLeads = responseRs?.allLeads?.map(lead => ({
                    label: lead.name,
                    value: lead.id,
                    email: lead.email,
                    contact_no: lead.contact_no
                }));
                const extractedAmount = responseRs?.amount?.match(/[\d,]+(\.\d{2})?/)[0];
                setLeadData({ ...leadData, MatchingData: responseRs?.matchedLeads, AllLeads: transformedLeads, amount: extractedAmount })
                setScanDiv(true)

            } else {
                setscanStart(false);
                setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
                setTimeout(() => setShowAlerts(false), 2000);
            }
        } catch (error) {
            setscanStart(false);
            console.log('error', error);
        }
    }
    return (
        <div>
            {!Filebase64 ?
                <div className='col-md-8 offset-md-2 upload-image-box text-center p-2' style={{ background: '#F8F8F8' }}>
                    <img src={Images.upload_icon} className='p-1 mt-2 units_box' style={{ height: "40px" }} />
                    <br />
                    <button className='text-center my-3 SuccessBtn ms-3'
                        onClick={handleButtonClick}>
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.svg"
                            onChange={handleFileChange}
                            className="ms-3 cursor-pointer"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        Upload Image
                    </button>
                </div>
                :
                <p className='fontwhite font-13'>
                    <div className="check-container ">
                        <img src={Filebase64} alt="Upload" className='check-image' />
                        {scanStart &&
                            <>
                                <img src={Images.left_top_corner} className='position-absolute top-0 start-0' />
                                <img src={Images.right_top_corner} className='position-absolute top-0 end-0' />
                                <img src={Images.left_bottom_corner} className='position-absolute bottom-0 start-0' />
                                <img src={Images.right_bottom_corner} className='position-absolute bottom-0 end-0' />
                                <div className="scan-overlay" id="scanOverlay"></div>
                            </>
                        }
                    </div>
                    <br />
                    {!scanDiv && (
                        <button className='text-center SuccessBtn ' onClick={handleFileUpload}>
                            <img src={Images.white_scan} className='pe-1 bigiconsize' />
                            Scan Cheque Details
                        </button>
                    )}
                    <button className='text-center CancelBtn ms-2 ' onClick={(e) => {
                        setFile(null); setFilebase64(null); setScanDiv(false);
                        setLeadData({ ...leadData, MatchingData: [], AllLeads: [], amount: '' });
                        setErrorMsg(false)
                    }}>
                        Clear
                    </button>
                </p>
            }
            {errorMsg &&
                <label className='text-danger py-3'>
                    <img src={Images.empty} className='bigiconsize pe-2' />
                    No Lead Data Found
                </label>
            }
        </div>
    )
}
