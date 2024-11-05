import React, { useCallback, useEffect, useState } from 'react';
import AddUpdateInventory from './AddUpdateInventory';
import AddInventoryUsage from './AddInventoryUsage';
import AddPurchaseOrder from '../../pages/Purchase-Order/AddPurchaseOrder';
import CustomModal from '../../utils/CustomModal';
import Images from '../../utils/Images';
import useApiService from '../../hooks/useApiService'
import AlertComp from '../../components/AlertComp';
import useProperty from '../../hooks/useProperty';
import CustomPagination from '../../components/pagination/CustomPagination';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { faArrowUpAZ, faArrowUpFromBracket, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default function AllInventories() {
  const { postAPIAuthKey, getAPIAuthKey } = useApiService();
  const { schemeId } = useProperty();
  const [inventoryPopup, setInventoryPopup] = useState(false);
  const [inventoryUsagePopup, setInventoryUsagePopup] = useState(false);
  const [purchaseOrderPopup, setpurchaseOrderPopup] = useState(false);
  const [formData, setFormData] = useState({ name: '', currentStock: '', minStock: '', unitPrice: '' });
  const [usageformData, setUsageFormData] = useState({ utilizationQty: '', date: '', note: '' });
  const [poformData, setPoFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAlerts, setShowAlerts] = useState(null);
  const [addUpdateFlag, setAddUpdateFlag] = useState(0);
  const [errorAlert, setErrorAlert] = useState(null);
  const [utils, setUtils] = useState({ search: '', sortbykey: 'asc', sortbyvalue: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryDetails, setInventoryDatails] = useState({});
  const showErrorAlert = (message) => {
    setErrorAlert(<AlertComp show={true} variant="danger" message={message} />);
    setTimeout(() => setErrorAlert(null), 2000);
  };
  const debouncedSearch = useCallback(debounce((searchValue) => {
    getAllInventories(searchValue, utils.sortbyvalue);
  }, 500), [utils.sortbyvalue, currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSort = (sortByValue) => {
    setUtils((prev) => ({ ...prev, sortbyvalue: sortByValue }));
    getAllInventories(utils.search, sortByValue);
  };
  useEffect(() => {
    getAllInventories(utils.search, utils.sortbyvalue);
  }, [currentPage]);

  const getAllInventories = async (search = '', sortbyvalue = null) => {
    const sortby = utils.sortbykey == 'asc' ? 'desc' : 'asc';
    const searchstring = search == '' ? null : search;
    setLoading(true);

    const result = await getAPIAuthKey(`/all-inventories/${searchstring}&${sortby}&${sortbyvalue}&${currentPage}&${itemsPerPage}&${schemeId}`);
    const responseRs = JSON.parse(result);

    setInventoryData(responseRs.data);
    setTotalItems(responseRs.total);
    setUtils((prev) => ({ ...prev, sortbykey: sortby }));
    setLoading(false);
  };
  const handleAddInventory = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        unitPrice: values.unitPrice,
        stock: values.currentstock,
        minStock: values.minstock,
        propertyId: schemeId,
        vendorId: values.vendorId,
        addUpdateFlag,
        inventoryId: values.inventoryId || 0,

      };
      const raw = JSON.stringify(payload);
      const result = await postAPIAuthKey('/add-edit-inventory', raw);
      const responseRs = JSON.parse(result);

      if (responseRs.status == 'success') {
        setInventoryPopup(false);
        setShowAlerts(<AlertComp show={true} variant="success" message={responseRs.message} />);
        getAllInventories(utils.search, utils.sortbyvalue);
      } else {
        showErrorAlert(responseRs.message);
      }

      setTimeout(() => setShowAlerts(<AlertComp show={false} />), 2000);
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.error(error);
    }
  }
  const getInventoryById = async (Inventoryid,Flag) => {
    if (!Inventoryid) return;
    setLoading(true);
    try {
      const result = await getAPIAuthKey(`/get-inventory-details/${Inventoryid}`);
      if (!result) {
        throw new Error('Something went wrong');
      }
      const responseRs = JSON.parse(result);
      const poFormData = {
        inventoryDetails: responseRs, // Pass the entire inventory object
      };

      if (Flag == 1) {
        setInventoryPopup(true);
      } else {
        setPoFormData({ inventoryDetails: responseRs });
        setpurchaseOrderPopup(true);
      }
   
      setLoading(false);
      setFormData({
        ...formData,
        inventoryId: Inventoryid,
        name: responseRs.name,
        unitPrice: responseRs.price_per_quantity,
        currentstock: responseRs.current_quantity,
        minstock: responseRs.reminder_quantity,
        propertyId: schemeId,
        vendorId: responseRs.inventory_log_details?.vendor.id || '',
        addUpdateFlag
      });
      setAddUpdateFlag(1);
    
    }
    catch (error) {
      setLoading(false);
      console.error(error);
    }
  }


  const handleHide = () => setInventoryPopup(false);
  const handleHideForUsage = () => setInventoryUsagePopup(false);
  const handleHideForPo = () => setpurchaseOrderPopup(false);

  const AddInventoryUsageData = async (values) => {
    setLoading(true);
    const payload = {
      inventoryId: values.inventoryId,
      notes: values.note,
      date: values.date,
      utilizedQuantity: values.utilizationQty,
    };
    const raw = JSON.stringify(payload);

    try {
      const result = await postAPIAuthKey('/add-usage-log', raw);
      const responseRs = JSON.parse(result);

      if (responseRs.status == 'success') {
        setInventoryUsagePopup(false);
        setShowAlerts(<AlertComp show={true} variant="success" message={responseRs.message} />);
        getAllInventories(utils.search, utils.sortbyvalue);
      } else {
        showErrorAlert(responseRs.message);
      }
      setTimeout(() => setShowAlerts(<AlertComp show={false} />), 2000);
      setLoading(false);
    } catch (error) {
      console.error('API call error: ', error);
      showErrorAlert('An error occurred while processing your request.');
    }
  };


  const GeneratePo = async (rowData) => {
    setLoading(true);
    const raw = JSON.stringify(rowData);
    try {
      const result = await postAPIAuthKey('/generate-po', raw);
      const responseRs = JSON.parse(result);

      if (responseRs.status == 'success') {
        setpurchaseOrderPopup(false);
        setShowAlerts(<AlertComp show={true} variant="success" message={responseRs.message} />);
        getAllInventories(utils.search, utils.sortbyvalue);
      } else {
        showErrorAlert(responseRs.message);
      }
      setTimeout(() => setShowAlerts(<AlertComp show={false} />), 2000);
      setLoading(false);
    } catch (error) {
      console.error('API call error: ', error);
      showErrorAlert('An error occurred while processing your request.');
    }
  };

  const handlePurchaseOrderClick = (inventoryId) => {
    getInventoryById(inventoryId,2)
      .then(() => setpurchaseOrderPopup(true)) // Open Purchase Order popup after fetching details
      .catch((error) => console.error('Error fetching inventory details:', error));
  };

  return (
    <div>

      <div className='PageHeader'>
        <div className='row align-items-center'>
          <div className='col-6'>
            <label className='graycolor cursor-pointer'>All Inventories</label>
          </div>
          <div className='col-6 font-13 d-flex justify-content-end'>
            <div className='fontwhite cursor-pointer px-2 d-flex align-items-center' onClick={() => {
              setInventoryPopup(true);
              setFormData({ name: '', currentStock: '', minStock: '', unitPrice: '' });
              setAddUpdateFlag(0);
            }}>
              <img src={Images.addicon} className='bigiconsize pe-2' alt="Add icon" />
              Add Inventory
            </div>
            <div className='fontwhite cursor-pointer px-2 d-flex align-items-center' onClick={(e) => navigate('/upload-csv')}>
              <img src={Images.upload} className='iconsize pe-2' />
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

      <div className="InventpryTable GridData">
        <div className="GridHeader">
          <div className="row">
            <div className="col-md-3 cursor-pointer" title="Sort by Name" onClick={() => handleSort('name')}>
              Name<FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
            </div>
            <div className="col-md-2 cursor-pointer ps-1" title="Sort by Price" onClick={() => handleSort('price_per_quantity')}>
              Price/quantity<FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
            </div>
            <div className="col-md-3 cursor-pointer" title="Sort by Quantity" onClick={() => handleSort('current_quantity')}>
              Available Quanity<FontAwesomeIcon icon={faArrowUpAZ} className="ps-1" />
            </div>
            <div className="col-md-2 cursor-pointer" title="Sort by Vendor">
              Vendor
            </div>
            <div className="col-md-2 text-center">Action</div>

          </div>
        </div>

        {inventoryData.map((inventory, index) => (
          <div className="row GridData" key={index}>
            <div className="col-md-3 ps-3">{inventory.name}</div>
            <div className="col-md-2">{inventory.price_per_quantity}</div>
            <div className="col-md-3">{inventory.current_quantity}</div>
            <div className="col-md-2">{inventory.inventory_log_details?.vendor.name}</div>
            <div className="col-md-2 d-flex justify-content-center align-items-center gap-2">
              <img
                src={Images.gridEdit}
                className='cursor-pointer'
                title='Edit Inventory'
                onClick={(e) => getInventoryById(inventory.id,1)}
                style={{ width: '22px', height: '22px' }}
              />

              <label
                className='cursor-pointer m-0'
                title="Add Usage"
                onClick={() => {
                  setInventoryUsagePopup(true);
                  setUsageFormData({ ...usageformData, maxQuantity: inventory.current_quantity, inventoryId: inventory.id });
                }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="bi bi-clock-history" style={{ fontSize: '18px' }}></i>
              </label>

              <img
                src={Images.purchaseOrderIcon}
                className='cursor-pointer'
                title='Purchase Order'
                onClick={() => {
                  setPoFormData({ ...poformData, inventoryDetails: inventoryDetails });
                  handlePurchaseOrderClick(inventory.id);
                }}
                style={{ width: '20px', height: '20px' }}
              />
            </div>

          </div>
        ))}
        <CustomPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} handlePageChange={handlePageChange} />
      </div>
      {showAlerts}
      {errorAlert}
      <CustomModal
        isShow={inventoryPopup}
        size="lg"
        title="Add Inventory"
        bodyContent={
          <AddUpdateInventory
            formData={formData}
            setFormData={setFormData}
            handleAddInventory={handleAddInventory}
            handleHide={handleHide}
          />
        } closePopup={handleHide}
      />
      <CustomModal
        isShow={inventoryUsagePopup}
        size="lg"
        title="Add Inventory Usage"
        bodyContent={
          <AddInventoryUsage
            formData={usageformData}
            setFormData={setUsageFormData}
            AddInventoryUsageData={AddInventoryUsageData}
            handleHide={handleHideForUsage}
          />
        } closePopup={handleHideForUsage}
      />
      <CustomModal
        isShow={purchaseOrderPopup}
        size="lg"
        title="Add Purchase Order"
        bodyContent={
          <AddPurchaseOrder
            formData={poformData} // Pass the prepared inventory details
            setFormData={setPoFormData}
            GeneratePo={GeneratePo}
            handleHide={handleHideForPo}
          />
        }
        closePopup={handleHideForPo}
      />
    </div>
  )
}
