import React, { useCallback, useEffect, useState } from 'react';
import Images from '../../utils/Images';
import CustomModal from '../../utils/CustomModal';
import AlertComp from '../../components/AlertComp';
import useApiService from '../../hooks/useApiService';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpAZ } from '@fortawesome/free-solid-svg-icons';
import CustomPagination from '../../components/pagination/CustomPagination'
import useProperty from '../../hooks/useProperty';
export default function AllPurchases() {
  const { schemeId } = useProperty();
  const { postAPIAuthKey, getAPIAuthKey } = useApiService();
  const [showAlerts, setShowAlerts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [purchaseData, setpurchaseData] = useState([]);
  const [utils, setUtils] = useState({ search: '', sortbykey: 'asc', sortbyvalue: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

const debouncedSearch = useCallback(debounce((searchValue) => {
  getAllPurchases(searchValue, utils.sortbyvalue);
}, 500), [utils.sortbyvalue, currentPage]);

useEffect(() => {
  getAllPurchases(utils.search, utils.sortbyvalue);
}, [currentPage]);

const getAllPurchases = async (search = '', sortbyvalue = null) => {
    const sortby = utils.sortbykey == 'asc' ? 'desc' : 'asc';
    const searchstring = search == '' ? null : search;
    setLoading(true);

    const result = await getAPIAuthKey(`/get-po-details/${schemeId}&${searchstring}&${sortby}&${sortbyvalue}&${currentPage}&${itemsPerPage}`);
    const responseRs = JSON.parse(result);
    
    setpurchaseData(responseRs.data);
    setTotalItems(responseRs.total);
    setUtils((prev) => ({ ...prev, sortbykey: sortby }));
    setLoading(false);
};

const handleSort = (sortByValue) => {
    setUtils((prev) => ({ ...prev, sortbyvalue: sortByValue }));
    getAllPurchases(utils.search, sortByValue);
};


const handlePageChange = (page) => setCurrentPage(page);
  return (
    <div>
    <div className="PageHeader">
      <div className="row align-items-center">
        <div className="col-6">
          <label className="graycolor cursor-pointer">All Purchases</label>
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
  
    <div className="GridData">
      <div className="GridHeader">
        <div className="row">
          <div className="col-md-2 cursor-pointer" title="Sort by Id">
            PO Number <FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
          </div>
          <div className="col-md-2 cursor-pointer ps-1" title="Sort by price">
            Amount <FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
          </div>
          <div className="col-md-2 cursor-pointer" title="Sort by created_at">
            Ordered Date <FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
          </div>
          <div className="col-md-2 cursor-pointer" title="Sort by Vendor">
            Vendor <FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
          </div>
          <div className="col-md-2 text-center" title="Status">Status</div>
          <div className="col-md-2 text-center">Action</div>
        </div>
      </div>
    </div>
  
    {purchaseData.map((purchase, index) => {
      let status;
      if (purchase.status == 1) {
        status = 'pending';
      } else if (purchase.status == 2) {
        status = 'partially';
      } else {
        status = 'received';
      }
  
      const formattedDate = purchase.created_at
      ? new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(purchase.created_at))
      : '';

      return (
        <div className="row GridData" key={index}>
          <div className="col-md-2 ps-3">{purchase.id}</div>
          <div className="col-md-2">{purchase.price}</div>
          <div className="col-md-2">{formattedDate}</div>
          <div className="col-md-2">{purchase.vendor_details.company_name}</div>
          <div className="col-md-2 text-center">{status}</div>
          <div className="col-md-2 text-center">
          </div>
        </div>
      );
    })}
  
    <CustomPagination
      currentPage={currentPage}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      handlePageChange={handlePageChange}
    />
  </div>
  
  )
}
