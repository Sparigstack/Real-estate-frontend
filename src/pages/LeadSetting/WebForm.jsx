import { faCopy, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import Cookies from 'js-cookie';

export default function WebForm() {
    const userId = Cookies.get('userId');
    const frontendurl = import.meta.env.VITE_Frontend_URL;
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
    const iframeCode = `<iframe src="${frontendurl}/webform/${userId}" width="100%" height="300px"></iframe>`;
    return (
        <div>
            <label>You can copy the link and share it as a webform. If you send the webform link to someone and they place it on their website or any other platform, they will be able to collect leads through that webform.</label>
            <div className='col-12 py-2'>
                <b className='text-decoration-underline'>Webform iFrame</b>
                <FontAwesomeIcon className='cursor-pointer ps-2' icon={faCopy} onClick={() => handleCopyClick(iframeCode)} />
                <FontAwesomeIcon icon={faShareNodes} className='cursor-pointer ps-2' onClick={() => handleShareClick(iframeCode)} />
                <label className='ps-5'>
                    {showcopymsg && <label className="pt-2">Copied!</label>}
                </label>
            </div>
            <pre>{iframeCode}</pre>
        </div>
    )
}
