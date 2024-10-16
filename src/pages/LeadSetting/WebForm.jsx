import React, { useState } from 'react'
import useProperty from '../../hooks/useProperty';
import Images from '../../utils/Images';

export default function WebForm() {
    const { schemeId } = useProperty();
    const frontendurl = import.meta.env.VITE_REDIRECT_URL;
    const [showcopymsg, setshowcopymsg] = useState(false)
    const handleCopyClick = (labelValue) => {
        navigator.clipboard.writeText(labelValue);
        setshowcopymsg(true);
        setTimeout(() => setshowcopymsg(false), 2000);
    };
    const handleShareClick = (labelValue) => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this webform!',
                text: 'You can use this link to collect leads:',
                url: labelValue,
            })
                .then(() => console.log('Link shared successfully!'))
                .catch((error) => console.error('Error sharing the link:', error));
        } else {
            alert('Web Share API is not supported in your browser.');
        }
    };
    const iframeCode = `<iframe src="${frontendurl}/webform/${schemeId}" width="100%" height="300px"></iframe>`;
    return (
        <div className='font-14'>
            <label style={{ textAlign: "justify" }}>You can copy the link and share it as a webform. If you send the webform link to someone and they place it on their website or any other platform, they will be able to collect leads through that webform.</label>
            <div className='col-12 py-2 pt-4'>
                <b className='text-decoration-underline'>Webform iFrame</b>
                <img src={Images.copyicon} className='cursor-pointer ps-2 bigiconsize' onClick={() => handleCopyClick(iframeCode)} />
                <img src={Images.share} className='cursor-pointer ps-2 bigiconsize' onClick={() => handleShareClick(iframeCode)} />
                <label className='ps-5'>
                    {showcopymsg && <label style={{ color: "#03053d" }}>Copied!</label>}
                </label>
            </div>
            <label className='font-13 pt-3'>{iframeCode}</label>
        </div>
    )
}
