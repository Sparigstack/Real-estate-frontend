import React from 'react';
import { useLocation } from 'react-router-dom';

export default function PreviewPurchaseOrder() {
    const location = useLocation(); // Get the current location
    const { formData = {}, total = 0 } = location.state || {}; // Destructure with defaults

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = "purchase_order.json"; // Set the desired file name and format
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <div>
                    <h4 className='text-decoration-underline'>Vendor Details</h4>
                    <p><strong>Name:</strong> {formData.inventoryDetails?.inventory_log_details?.vendor?.name || 'N/A'}</p>
                    <p><strong>Company:</strong> {formData.inventoryDetails?.inventory_log_details?.vendor?.company_name || 'N/A'}</p>
                    <p><strong>Email:</strong> {formData.inventoryDetails?.inventory_log_details?.vendor?.email || 'N/A'}</p>
                    <p><strong>Contact:</strong> {formData.inventoryDetails?.inventory_log_details?.vendor?.contact || 'N/A'}</p>
                </div>
                <div>
                    <h4 className='text-decoration-underline'>Customer Details</h4>
                    <p><strong>Name:</strong> {formData.inventoryDetails?.property_details?.user?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {formData.inventoryDetails?.property_details?.user?.email || 'N/A'}</p>
                    <p><strong>Contact:</strong> {formData.inventoryDetails?.property_details?.user?.contact_no || 'N/A'}</p>
                    <p><strong>Property:</strong> {formData.inventoryDetails?.property_details?.name || 'N/A'}</p>
                </div>
            </div>
            <div>
                <h4 className='text-decoration-underline'>Order Details</h4>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Product Name</th>
                            <th style={tableHeaderStyle}>Price per Quantity</th>
                            <th style={tableHeaderStyle}>Quantity</th>
                            <th style={tableHeaderStyle}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={tableDataStyle}>{formData.inventoryDetails?.name || 'N/A'}</td>
                            <td style={tableDataStyle}>₹{formData.inventoryDetails?.price_per_quantity || 0}</td>
                            <td style={tableDataStyle}>{formData.inventoryDetails?.quantity || 0}</td>
                            <td style={tableDataStyle}>₹{total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={buttonContainerStyle}>
                <button onClick={handleDownload} className="btn btn-primary">
                    Download Order
                </button>
            </div>
        </div>
    );
}

// Styles
const containerStyle = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
};

const tableHeaderStyle = {
    borderBottom: '2px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
    fontSize: '16px',
};

const tableDataStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#fff',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
};
