import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Images from '../../utils/Images';
import useProperty from '../../hooks/useProperty';
import useAuth from '../../hooks/useAuth';

export default function RestApi() {
    const { userDetails } = useAuth();
    const { propertyDetails } = useProperty();
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [showcopymsg, setshowcopymsg] = useState(false)
    const handleCopyClick = (labelValue) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(labelValue)
                .then(() => {
                    setshowcopymsg(true);
                    setTimeout(() => setshowcopymsg(false), 2000);
                })
                .catch((error) => console.error('Error copying text:', error));
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = labelValue;
            textarea.style.position = 'fixed';
            textarea.style.opacity = 0;
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                document.execCommand('copy');
                setshowcopymsg(true);
                setTimeout(() => setshowcopymsg(false), 2000);
            } catch (error) {
                console.error('Fallback: Error copying text', error);
                alert('Copy failed. Please copy manually.');
            }

            document.body.removeChild(textarea);
        }
    };
    return (
        <>
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => navigate('/all-leads')}>All Leads /</label> Rest API</div>
                </div>
            </div>
            <div className='row mt-3 px-3'>
                <div className='square-boxes font-14 p-3'>
                    <div className='col-12'>
                        <h5>Overview :</h5>
                        <p className='m-0'>This guide will help you understand how to add a lead to our system using the REST API. You will need to make a POST request to the API endpoint, provide the required lead data in JSON format, and include authentication headers.</p>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>API Endpoint :</h5>
                        <p>To add a lead, send a POST request to the following API endpoint:</p>
                        <label style={{ border: "1px solid gray", borderRadius: "5px" }} className='p-2'>
                            {BASE_URL}/generate-lead?client_id=CLIENT_ID&client_secret_key=CLIENT_SECRET_KEY
                            <img src={Images.copyicon} className='cursor-pointer ps-2 bigiconsize' onClick={() => handleCopyClick(`${BASE_URL}/generate-lead?client_id=CLIENT_ID&client_secret_key=CLIENT_SECRET_KEY`)} />
                        </label>
                        <label className='ps-5' >
                            {showcopymsg && <label className="pt-2">Copied.</label>}
                        </label>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>Request Method :</h5>
                        <ul className='m-0'><li>POST</li></ul>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>Request Headers :</h5>
                        <p className='m-0'>
                            You need to include the following headers to authenticate your request. The client_id and client_secret_key are unique for your account and can be found on the Lead Settings page.
                        </p>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>JSON Payload :</h5>
                        <p className='m-0'>
                            The body of the request must contain the lead's information in the following JSON format. Replace the placeholder values with actual data:
                        </p>
                        <label style={{ border: "1px solid gray", borderRadius: "5px" }} className='p-2 mt-2'>
                            {`{"userCapabilities":"webform_api_integrations",
                                "leads":[{
                                "name": "Parijjjji",
                                "email": "parioooo@gmail.com",
                                "contact": "1324354654",
                                "source": "call",
                                "status":"New",
                                "property": "${propertyDetails.name}",
                                "notes":null
                            },{
                                "name": "Jackson",
                                "email": "jackson@gmail.com",
                                "contact": "9865356718",
                                "source": "In Person",
                                "status":"Hot",
                                "property": "${propertyDetails.name}",
                                "notes":"testing notes"
                            }]}
                            `}
                        </label>
                        <h6 className='pt-2'>Explanation of Fields:</h6>
                        <ul className='m-0'>
                            <li><b>name :</b>The full name of the lead.</li>
                            <li><b>email :</b>The email address of the lead.This is optional field.</li>
                            <li><b>contact :</b>The contact number of the lead.</li>
                            <li><b>source :</b>The source from which the lead originated (e.g., "Reference", "Social Media", "Call","In Person","Agent").</li>
                            <li><b>status :</b>The status of lead (e.g., "New", "Hot", "Cold","Dead","Lead to Customer").</li>
                            <li><b>property :</b>The property or service the lead is interested in.</li>
                            <li><b>notes :</b>The notes related to lead.</li>
                        </ul>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>Example Request :</h5>
                        <p className='m-0'>
                            Below is an example of how your full API call should look when you're adding a new lead:
                        </p>
                        <label style={{ border: "1px solid gray", borderRadius: "5px" }} className='p-2 mt-2'>
                            <b>POST : </b> <br />{BASE_URL}/generate-lead?client_id=CLIENT_ID&client_secret_key=CLIENT_SECRET_KEY
                            <br />
                            <br />
                            <b>Body : </b>
                            <br />
                            {`{"userCapabilities":"webform_api_integrations",
                            "leads":[{
                                "name": "Parijjjji",
                                "email": "parioooo@gmail.com",
                                "contact": "1324354654",
                                "source": "call",
                                "status":"New",
                                "property": "${propertyDetails.name}",
                                "notes":null
                            },{
                                "name": "Jackson",
                                "email": "jackson@gmail.com",
                                "contact": "9865356718",
                                "source": "In Person",
                                "status":"Hot",
                                "property": "${propertyDetails.name}",
                                "notes":"testing notes"
                            }]}
                            `}
                        </label>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>Response :</h5>
                        <p className='m-0'>If the request is successful, you will receive a response in JSON format indicating the success of the lead generation. A typical successful response will look like this:</p>
                        {`{
                                "status": "success",
                                "message": "Lead created successfully."
                            }
                        `}
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>Error Handling :</h5>
                        <p className='m-0'>In case of an error, you will receive an error message detailing what went wrong. Common error responses include:</p>
                        <ul className='m-0'>
                            <li><b>Invalid Authentication:</b> If the client_id or client_secret_key is incorrect.</li>
                            <li><b>Missing or Invalid Data:</b> If required fields in the JSON payload are missing or improperly formatted.</li>
                            <li><b>Property not found:</b> If the property is not found for this lead.</li>
                        </ul>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>Conclusion :</h5>
                        <p>
                            By following these steps and using the correct headers and payload, you can successfully add leads to the system via our REST API.
                            <br />
                            Ensure that your client_id and client_secret_key are secure and only used in authorized requests.
                            <br />
                            For any issues or further assistance, feel free to contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
