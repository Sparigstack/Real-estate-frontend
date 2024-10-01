import React from 'react'
import HeaderName from '../../utils/HeaderName'

export default function RestApi() {
    return (
        <>
            <HeaderName header="Lead Setting / Rest API" />
            <div className='fontwhite'>
                <div className='col-12'>
                    <h3>Overview:</h3>
                    <p>
                        This guide will help you understand how to add a lead to our system using the REST API. You will need to make a POST request to the API endpoint, provide the required lead data in JSON format, and include authentication headers.
                    </p>
                </div>
                <hr />
                <div className='col-12'>
                    <h3>API Endpoint:</h3>
                    <p>
                        To add a lead, send a POST request to the following API endpoint:
                    </p>
                    <div className='box'>
                        http://127.0.0.1:8000/api/generate-lead
                    </div>
                </div>
                <div className='col-12'>
                    <h3>Request Method:</h3>
                    <ul>
                        <li>POST</li>
                    </ul>
                </div>
                <div className='col-12'>
                    <h3>Request Headers:</h3>
                    <p>
                        You need to include the following headers to authenticate your request. The client_id and client_secret_key are unique for your account and can be found on the Lead Settings page.
                    </p>
                </div>
                <div className='col-12'>
                    <h3>JSON Payload:</h3>
                    <p>
                        The body of the request must contain the lead's information in the following JSON format. Replace the placeholder values with actual data:
                    </p>
                    <label>
                        {`{
                            "name": "Parijjjji",
                            "email": "parioooo@gmail.com",
                            "contact": "1324354654",
                            "budget": 89898,
                            "source": "call",
                            "property": "TUUll"
                        }
                        `}
                    </label>
                    <h5>Explanation of Fields:</h5>
                    <ul>
                        <li>
                            <b>name :</b>The full name of the lead.
                            <b>email :</b>The email address of the lead.
                            <b>contact :</b>The contact number of the lead.
                            <b>budget :</b>The budget amount (e.g., for property or service requirements).
                            <b>source :</b>The source from which the lead originated (e.g., "call", "email", "web form").
                            <b>property :</b>The property or service the lead is interested in.
                        </li>
                    </ul>
                </div>
                <div className='col-12'>
                    <h3>Example Request:</h3>
                    <p>
                        Below is an example of how your full API call should look when you're adding a new lead:
                    </p>
                    <p>
                        POST http://127.0.0.1:8000/api/generate-lead
                        {`Headers:
                        {
                            "client_id": "client_66f66873e21ed9.51951369",
                        "client_secret_key": "991af0d630ac04698efcb8129045c3d2",
                        "Content-Type": "application/json"
}

                        Body:
                        {
                            "name": "Parijjjji",
                        "email": "parioooo@gmail.com",
                        "contact": "1324354654",
                        "budget": 89898,
                        "source": "call",
                        "property": "TUUll"
}`}

                    </p>
                </div>
                <div className='col-12'>
                    <h3>Response:</h3>
                    <p>If the request is successful, you will receive a response in JSON format indicating the success of the lead generation. A typical successful response will look like this:</p>
                    <label>
                        {`{
    "status": "success",
    "message": "Lead has been successfully added."
}
`}
                    </label>
                </div>
                <div className='col-12'>
                    <h3>Error Handling:</h3>
                    <p>In case of an error, you will receive an error message detailing what went wrong. Common error responses include:</p>
                    <ul>
                        <li><b>Invalid Authentication:</b> If the client_id or client_secret_key is incorrect.</li>
                        <li><b>Missing or Invalid Data:</b> If required fields in the JSON payload are missing or improperly formatted.</li>
                    </ul>
                </div>
                <div className='col-12'>
                    <b>Conclusion:</b>
                    <p>
                        By following these steps and using the correct headers and payload, you can successfully add leads to the system via our REST API. Ensure that your client_id and client_secret_key are secure and only used in authorized requests.

                        For any issues or further assistance, feel free to contact our support team.
                    </p>
                </div>
            </div>
        </>
    )
}
