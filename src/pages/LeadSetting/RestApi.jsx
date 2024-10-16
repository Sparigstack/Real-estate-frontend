import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Images from '../../utils/Images';
import useProperty from '../../hooks/useProperty';

export default function RestApi() {
    const { propertyDetails } = useProperty();
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [showcopymsg, setshowcopymsg] = useState(false)
    const handleCopyClick = (labelValue) => {
        navigator.clipboard.writeText(labelValue);
        setshowcopymsg(true);
        setTimeout(() => setshowcopymsg(false), 2000);
    };
    return (
        <>
            <div className='PageHeader'>
                <div className='row align-items-center'>
                    <div className='col-6'><label className='graycolor cursor-pointer' onClick={(e) => navigate('/lead-management')}>Lead Setting /</label> Rest API</div>
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
                            {BASE_URL}/generate-lead
                            <img src={Images.copyicon} className='cursor-pointer ps-2 bigiconsize' onClick={() => handleCopyClick(`${BASE_URL}/generate-lead`)} />
                        </label>
                        <label className='ps-5' >
                            {showcopymsg && <label className="pt-2">Copied!</label>}
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
                            {`{"leads":[{
                                "name": "Parijjjji",
                                "email": "parioooo@gmail.com",
                                "contact": "1324354654",
                                "budget": 89898,
                                "source": "call",
                                "property": "${propertyDetails.name}"
                            },{
                                "name": "Jackson",
                                "email": "jackson@gmail.com",
                                "contact": "9865356718",
                                "budget": 200000,
                                "source": "In Person",
                                "property": "${propertyDetails.name}"
                            }]}
                            `}
                        </label>
                        <h6 className='pt-2'>Explanation of Fields:</h6>
                        <ul className='m-0'>
                            <li><b>name :</b>The full name of the lead.</li>
                            <li><b>email :</b>The email address of the lead.</li>
                            <li><b>contact :</b>The contact number of the lead.</li>
                            <li><b>budget :</b>The budget amount (e.g., for property or service requirements).</li>
                            <li><b>source :</b>The source from which the lead originated (e.g., "call", "email", "web form").</li>
                            <li><b>property :</b>The property or service the lead is interested in.</li>
                        </ul>
                    </div>
                    <hr />
                    <div className='col-12'>
                        <h5>Example Request :</h5>
                        <p className='m-0'>
                            Below is an example of how your full API call should look when you're adding a new lead:
                        </p>
                        <label style={{ border: "1px solid gray", borderRadius: "5px" }} className='p-2 mt-2'>
                            <b>POST : </b> {BASE_URL}/generate-lead
                            <br />
                            <b>Headers : </b>
                            {`
                                {
                                    "client_id": "client_66f66873e21ed9.51951369",
                                    "client_secret_key": "991af0d630ac04698efcb8129045c3d2",
                                    "Content-Type": "application/json"
                                }
                            `}
                            <br />
                            <b>Body : </b>
                            {`{"leads":[{
                                "name": "Parijjjji",
                                "email": "parioooo@gmail.com",
                                "contact": "1324354654",
                                "budget": 89898,
                                "source": "call",
                                "property": "${propertyDetails.name}"
                            },{
                                "name": "Jackson",
                                "email": "jackson@gmail.com",
                                "contact": "9865356718",
                                "budget": 200000,
                                "source": "In Person",
                                "property": "${propertyDetails.name}"
                            }]}`}
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
