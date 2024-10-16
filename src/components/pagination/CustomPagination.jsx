import React, { useState } from 'react'
import Pagination from "rc-pagination";

export default function CustomPagination({ currentPage, totalItems, itemsPerPage, handlePageChange }) {
    const [inputValue, setInputValue] = useState(currentPage); // Track input value
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Update local state
    };

    const handleGoToPage = () => {
        const pageNumber = Number(inputValue);
        if (pageNumber >= 1 && pageNumber <= Math.ceil(totalItems / itemsPerPage)) {
            handlePageChange(pageNumber); // Call the page change handler
        }
    };
    return (
        <div className="custom-pagination-container">
            <div className="pagination-content ps-5">
                <Pagination
                    className="custom-pagination"
                    current={currentPage} // Current page number
                    total={totalItems}    // Total items count
                    pageSize={itemsPerPage} // Items per page
                    onChange={handlePageChange} // Function to handle page change
                    showLessItems
                />
            </div>
            {totalPages > 1 && (
                <div className="quick-jumper">
                    <label htmlFor="quick-jumper" className='font-13' style={{ color: "#E0E0E0" }}>Go to page</label>
                    <input
                        id="quick-jumper"
                        type="number"
                        min={1}
                        max={Math.ceil(totalItems / itemsPerPage)}
                        onChange={handleInputChange}
                        style={{ marginLeft: '5px', width: '50px' }} // Optional styling
                    />
                    <button className=' gotobtn' onClick={handleGoToPage}>Go <span style={{ fontSize: '16px', marginLeft: '2px' }}>›</span></button>
                </div>
            )}
        </div>
    )
}
