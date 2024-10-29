import React, { useCallback, useEffect, useState } from 'react';
import AddUpdateVendor from './AddUpdateVendor';
import Images from '../../utils/Images';
import CustomModal from '../../utils/CustomModal';
import AlertComp from '../../components/AlertComp';
import useApiService from '../../hooks/useApiService';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import CustomPagination from '../../components/pagination/CustomPagination'
export default function AllVendor() {
    const { postAPIAuthKey, getAPIAuthKey } = useApiService();
    const [showAlerts, setShowAlerts] = useState(null);
    const [vendorPopup, setVendorPopup] = useState(false);
    const [formData, setFormData] = useState({ name: '', companyName: '', email: '', contactNum: '' });
    const [loading, setLoading] = useState(false);
    const [addUpdateFlag, setAddUpdateFlag] = useState(0);
    const [errorAlert, setErrorAlert] = useState(null);
    const [vendorData, setVendorData] = useState([]);
    const [utils, setUtils] = useState({ search: '', sortbykey: 'asc', sortbyvalue: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const showErrorAlert = (message) => {
        setErrorAlert(<AlertComp show={true} variant="danger" message={message} />);
        setTimeout(() => setErrorAlert(null), 2000);
    };

    const debouncedSearch = useCallback(debounce((searchValue) => {
        getAllVendors(searchValue, utils.sortbyvalue);
    }, 500), [utils.sortbyvalue, currentPage]);

    useEffect(() => {
        getAllVendors(utils.search, utils.sortbyvalue);
    }, [currentPage]);

    const getAllVendors = async (search = '', sortbyvalue = null) => {
        const sortby = utils.sortbykey === 'asc' ? 'desc' : 'asc';
        const searchstring = search === '' ? null : search;
        setLoading(true);

        const result = await getAPIAuthKey(`/all-vendors/${searchstring}&${sortby}&${sortbyvalue}&${currentPage}&${itemsPerPage}`);
        const responseRs = JSON.parse(result);
        
        setVendorData(responseRs.data);
        setTotalItems(responseRs.total);
        setUtils((prev) => ({ ...prev, sortbykey: sortby }));
        setLoading(false);
    };

    const handleAddVendor = async (values) => {
        setLoading(true);
        const payload = {
            name: values.name,
            companyName: values.companyName,
            email: values.email,
            contactNum: values.contactNum,
            addUpdateFlag,
            vendorId: addUpdateFlag === 1 ? values.vendorId : 0,
        };
        const raw = JSON.stringify(payload);
        const result = await postAPIAuthKey('/add-edit-vendors', raw);
        const responseRs = JSON.parse(result);
    
        if (responseRs.status === 'success') {
            setVendorPopup(false);
            setShowAlerts(<AlertComp show={true} variant="success" message={responseRs.message} />);
            
            // Refresh the main grid data after a successful update
            getAllVendors(utils.search, utils.sortbyvalue);
        } else {
            showErrorAlert(responseRs.message);
        }
    
        setTimeout(() => setShowAlerts(<AlertComp show={false} />), 2000);
        setLoading(false);
    };
    

    const handleHide = () => setVendorPopup(false);

    const handleSort = (sortByValue) => {
        setUtils((prev) => ({ ...prev, sortbyvalue: sortByValue }));
        getAllVendors(utils.search, sortByValue);
    };

    const getVendorById = async (vendorid) => {
        if (!vendorid) return;
        setLoading(true);
        try {
            const result = await getAPIAuthKey(`/get-vendor-details/${vendorid}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setVendorPopup(true);
            setLoading(false);
            setFormData({
                ...formData,
                vendorId: vendorid,
                name: responseRs.name,
                companyName: responseRs.company_name,
                email: responseRs.email,
                contactNum: responseRs.contact
            });
            setAddUpdateFlag(1)
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }
    const handlePageChange = (page) => setCurrentPage(page);
    return (
        <div>
            <div className="PageHeader">
                <div className="row align-items-center">
                    <div className="col-6">
                        <label className="graycolor cursor-pointer">All Vendors</label>
                    </div>
                    <div className="col-6 font-13 d-flex justify-content-end">
                        <div
                            className="fontwhite cursor-pointer px-2 d-flex align-items-center"
                            onClick={() => {
                                setVendorPopup(true);
                                setFormData({ name: '', companyName: '', email: '', contactNum: '' });
                                setAddUpdateFlag(0);
                            }}
                        >
                            <img src={Images.addicon} className="bigiconsize pe-2" alt="Add icon" />
                            Add Vendors
                        </div>
                        <div
                            className="fontwhite cursor-pointer px-2 d-flex align-items-center"
                            onClick={() => navigate('/upload-csv')}
                        >
                            <img src={Images.upload} className="iconsize pe-2" alt="Upload CSV" />
                            Upload CSV
                        </div>
                    </div>
                </div>
            </div>

            <div className="row py-2 align-items-center">
                <div className="col-md-4 offset-md-8">
                    <div className="position-relative">
                        <img src={Images.searchIcon} alt="search-icon" className="search-icon" />
                        <input
                            type="text"
                            className="form-control searchInput"
                            placeholder="Search"
                            onChange={(e) => {
                                debouncedSearch(e.target.value);
                                setUtils({ ...utils, search: e.target.value });
                            }}
                        />
                    </div>
                </div>
            </div>

            {showAlerts}
            {errorAlert}

            <div className="vendorTable GridData">
                <div className="GridHeader">
                    <div className="row">
                        <div className="col-md-3 cursor-pointer" title="Sort by Name" onClick={() => handleSort('name')}>
                            Name<FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
                        </div>
                        <div className="col-md-2 cursor-pointer ps-1" title="Sort by Email" onClick={() => handleSort('email')}>
                            Email<FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
                        </div>
                        <div className="col-md-3 cursor-pointer" title="Sort by Company Name" onClick={() => handleSort('companyName')}>
                            Company Name<FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
                        </div>
                        <div className="col-md-2 cursor-pointer" title="Sort by Contact Number" onClick={() => handleSort('contactNum')}>
                            Contact<FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
                        </div>
                        <div className="col-md-2 text-center">Action</div>
                  
                    </div>
                </div>

                {vendorData.map((vendor, index) => (
                    <div className="row GridData" key={index}>
                        <div className="col-md-3 ps-3">{vendor.name}</div>
                        <div className="col-md-2">{vendor.email}</div>
                        <div className="col-md-3">{vendor.company_name}</div>
                        <div className="col-md-2">{vendor.contact}</div>
                        <div className="col-md-2 text-center">
                        <img src={Images.gridEdit} className='cursor-pointer iconsize me-2' title='Edit Vendor'
                        onClick={(e) => getVendorById(vendor.id)}/>
                        </div>
                    </div>
                ))}
                        
                        <CustomPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} handlePageChange={handlePageChange} />
            </div>

            <CustomModal
                isShow={vendorPopup}
                size="lg"
                title="Add Vendor"
                bodyContent={
                    <AddUpdateVendor
                        formData={formData}
                        setFormData={setFormData}
                        handleAddVendor={handleAddVendor}
                        handleHide={handleHide}
                    />
                }
                closePopup={handleHide}
            />
        </div>
    );
}
