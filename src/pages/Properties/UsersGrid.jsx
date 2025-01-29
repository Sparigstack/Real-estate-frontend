import React, { useEffect, useState } from 'react'
import useApiService from '../../hooks/useApiService'
import Cookies from 'js-cookie';
import Images from '../../utils/Images';
import AddUserModal from './AddUserModal';
import CustomModal from '../../utils/CustomModal';
import Loader from '../../components/loader/Loader';
import Switch from "react-switch";
import AlertComp from '../../components/alerts/AlertComp';
import DeleteModal from '../../utils/DeleteModal';

export default function UsersGrid() {
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();
    const userid = Cookies.get('userId');
    const [SubUserArray, setSubUserArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [PlanAlerts, setPlanAlerts] = useState(false);
    const [UserPopup, setUserPopup] = useState(false);
    const [SubUserId, setSubUserId] = useState(null);
    const [isDeleteModal, setisDeleteModal] = useState(false);
    const [addEditFlag, setaddEditFlag] = useState(0);
    useEffect(() => {
        getSubUsers();
    }, []);
    const getSubUsers = async () => {
        try {
            const result = await getAPIAuthKey(`/fetch-sub-user/${userid}`);
            if (!result || result == "") {
                return false;
            }
            const responseRs = JSON.parse(result);
            setSubUserArray(responseRs.data)
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleChange = async (checked, activedeleteflag, subuserid) => {
        setLoading(true);
        const raw = JSON.stringify({
            userId: userid,
            subuserId: subuserid || SubUserId,
            status: activedeleteflag == 1 ? checked ? 1 : 2 : null
        })
        const result = await postAPIAuthKey('/update-sub-user', raw);

        if (!result) {
            throw new Error('Something went wrong');
        }

        const responseRs = JSON.parse(result);
        setLoading(false);
        setisDeleteModal(false);
        getSubUsers();
        if (responseRs.status == 'success') {
            if (activedeleteflag == 1) {
                var msg = checked ? 'User Activated Successfully.' : 'User Inactive Successfully.';
            } else {
                var msg = 'User Deleted Successfully.';
            }
            setShowAlerts(<AlertComp show={true} variant="success" message={msg} />);
            setTimeout(() => {
                setShowAlerts(false);
            }, 2000);
        }
        else {
            setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
            setTimeout(() => {
                setShowAlerts(false);
            }, 5000);
        }
    };

    const handleGetEdit = async (item) => {
        setSubUserId(item.id);
        setaddEditFlag(2);
        setUserPopup(true);
    }
    return (
        <div className='usersdiv p-3 pb-5'>
            {showAlerts}
            {PlanAlerts}
            {loading && <Loader runningcheck={loading} />}
            <div className='row  align-items-center mb-3'>
                <div className='col-md-8'>
                    <h5 className='fontwhite mb-1 fw-semibold'>Users ({SubUserArray?.length ? SubUserArray?.length : 0})</h5>
                </div>
                <div className='col-md-4 text-end'>
                    <button type='button' className='WhiteBtn w-100 p-2 font-13' onClick={(e) => { setUserPopup(true); setaddEditFlag(1) }}>
                        <img src={Images.blackaddicon} className='img-fluid pe-1 iconsize' />Add User
                    </button>
                </div>
            </div>
            <div className='usersdiv'>
                <div className='userheader '>
                    <div className='row'>
                        <div className='col-3'>Name</div>
                        <div className='col-3'>Contact</div>
                        <div className='col-3 text-center'>User Status</div>
                        <div className='col-3'>Action</div>
                    </div>
                </div>
                <div>
                    {SubUserArray?.length ?
                        SubUserArray?.map((item, index) => {
                            return <div className='fontwhite usergrids' key={index}>
                                <div className='row '>
                                    <div className='col-3'>{item.name}</div>
                                    <div className='col-3'>{item.contact_no}</div>
                                    <div className='col-3 text-center'>
                                        <Switch
                                            checked={item.is_active == 1}
                                            onChange={(e) => { handleChange(e, 1, item.id) }}
                                            onColor="#AAB8FF"
                                            offColor="#303260"
                                            checkedIcon={<div style={{ color: "black", paddingLeft: 5 }}></div>}
                                            uncheckedIcon={<div style={{ color: "black", paddingLeft: 5 }}></div>}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <img src={Images.white_edit} className='h-75 cursor-pointer ms-2' title="Edit User"
                                            onClick={(e) => handleGetEdit(item)} />
                                        <img src={Images.white_delete} className='bigiconsize cursor-pointer ms-2' title="Edit User"
                                            onClick={(e) => { setSubUserId(item.id); setisDeleteModal(true) }} />
                                    </div>
                                </div>
                            </div>
                        })
                        :
                        <div className='col-12 text-center p-3 fontwhite'>
                            No Data Found
                        </div>
                    }
                </div>
            </div>

            <DeleteModal isShow={isDeleteModal} title={"Are you sure want to delete this user?"} Cancel={(e) => setisDeleteModal(false)}
                canceltext={"Cancel"} handleSuccess={(e) => handleChange(null, 2, null)} successtext={"Confirm"} />

            <CustomModal isShow={UserPopup} size={"md"} title={`${addEditFlag == 1 ? 'Add User' : 'Edit User'}`}
                bodyContent={<AddUserModal addEditFlag={addEditFlag} SubUserId={SubUserId} setLoading={setLoading} setShowAlerts={setShowAlerts} setPlanAlerts={setPlanAlerts}
                    getSubUsers={getSubUsers} hidePopup={(e) => setUserPopup(false)} />} closePopup={(e) => setUserPopup(false)} />
        </div>

    )
}
