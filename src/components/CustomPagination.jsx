import React from 'react'
// import "rc-pagination/assets/index.css";
import '../styles/custompagination.css';
import Pagination from "rc-pagination";

export default function CustomPagination({ currentPage, totalItems, itemsPerPage, handlePageChange }) {
    return (
        <Pagination
            className="custom-pagination"
            align='center'
            current={currentPage} // Current page number
            total={totalItems}    // Total items count
            pageSize={itemsPerPage} // Items per page
            onChange={handlePageChange} // Function to handle page change
        />
    )
}
