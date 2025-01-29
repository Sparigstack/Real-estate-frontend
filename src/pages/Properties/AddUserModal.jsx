import { ErrorMessage, Field, FieldArray, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap';
import useCommonApiService from '../../hooks/useCommonApiService';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import useApiService from '../../hooks/useApiService';
import Loader from '../../components/loader/Loader';
import AlertComp from '../../components/alerts/AlertComp';
import UpgradePlanAlerts from '../../components/UpgradePlan/UpgradePlanAlerts';
import Images from '../../utils/Images';

export default function AddUserModal({ addEditFlag, SubUserId, setLoading, hidePopup, setPlanAlerts, setShowAlerts, getSubUsers }) {
    const { getUserMenuAccess } = useCommonApiService();
    const { postAPIAuthKey, getAPIAuthKey } = useApiService();
    const userid = Cookies.get('userId');
    const [initialValues, setinitialValues] = useState({
        username: '',
        usercontact: '',
        selectedModules: [],
    });
    const [Menus, setMenus] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    useEffect(() => {
        const fetchMenuAccess = async () => {
            setShowLoader(true);
            const sources = await getUserMenuAccess(userid);
            setMenus(sources)
            setShowLoader(false);
        }
        fetchMenuAccess();
        getSubUserDetail();
    }, []);
    const getSubUserDetail = async () => {
        try {
            const result = await getAPIAuthKey(`/get-sub-user-detail/${SubUserId}`);
            if (!result || result == "") {
                return false;
            }
            const responseRs = JSON.parse(result);
            setinitialValues({
                ...initialValues,
                username: responseRs.username,
                usercontact: responseRs.usercontact,
                selectedModules: responseRs.selectedModules
            })
        }
        catch (error) {
            console.error(error);
        }
    }
    const submitUserDetails = async (values) => {
        setLoading(true);
        const raw = JSON.stringify({
            username: values.username,
            usercontact: values.usercontact,
            userId: userid,
            subuserId: SubUserId,
            selectedModules: values.selectedModules,
            userCapabilities: "role_access_users"
        });
        const result = await postAPIAuthKey('/add-sub-user', raw);

        if (!result) {
            throw new Error('Something went wrong');
        }

        const responseRs = JSON.parse(result);
        setLoading(false);
        hidePopup();
        getSubUsers();
        if (responseRs.status == 'success') {
            var msg = addEditFlag == 1 ? 'User Added Successfully.' : 'User Updated Successfully.';
            setShowAlerts(<AlertComp show={true} variant="success" message={msg} />);
            setTimeout(() => {
                setShowAlerts(false);
            }, 2000);
        }
        else if (responseRs.status == "upgradeplan") {
            setPlanAlerts(<UpgradePlanAlerts show={true} data={responseRs} previousPath={location.pathname} onhide={(e) => setPlanAlerts(false)} />);
        }
        else {
            setShowAlerts(<AlertComp show={true} variant="danger" message={responseRs.message} />);
            setTimeout(() => {
                setShowAlerts(false);
            }, 5000);
        }
    }
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('User Name is required.'),
        usercontact: Yup.string()
            .matches(/^[0-9]+$/, 'Contact number must be only digits')
            .length(10, 'Contact number must be exactly 10 digits')
            .required('Contact number is required'),
        selectedModules: Yup.array()
            .min(1, 'At least one module must be selected.')
            .required('At least one module must be selected.'),
    });
    return (
        <div>
            <Formik initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    submitUserDetails(values);
                }}>
                {({ handleSubmit, values }) => (
                    <Form className='' onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className='row'>
                            <div className='col-md-6 mb-4 ps-0 position-relative'>
                                <label className='input-labels'>Name <span className='text-danger'>*</span></label>
                                <Field type="text" className="custom-inputs" name='username' autoComplete='off' />
                                <ErrorMessage name='username' component="div" className="text-start errorText" />
                            </div>
                            <div className='col-md-6 mb-4 ps-0 position-relative'>
                                <label className='input-labels'>Contact no. <span className='text-danger'>*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text font-13">+91</span>
                                    <Field type="number" className="form-control custom-inputs" name='usercontact' autoComplete='off' />
                                </div>
                                <ErrorMessage name='usercontact' component="div" className="text-start errorText" />
                            </div>
                            <div className='row  px-0'>
                                <label className='fw-semibold'>Choose Module for User :</label>
                                {showLoader && (
                                    <img src={Images.loder} className="m-5 text-center" style={{ width: "50px" }} />
                                )}
                                <div className='ms-4 my-2 formLabel'>
                                    <FieldArray
                                        name="selectedModules"
                                        render={arrayHelpers => (
                                            <>
                                                {Menus.map((item, index) => (
                                                    <div className='col-12 my-1' key={index}>
                                                        <input
                                                            className="form-check-input me-2 normalbg"
                                                            type="checkbox"
                                                            name="selectedModules"
                                                            value={item.id}
                                                            checked={values.selectedModules.includes(item.id)}
                                                            onChange={e => {
                                                                if (e.target.checked) arrayHelpers.push(item.id);
                                                                else {
                                                                    const idx = values.selectedModules.indexOf(item.id);
                                                                    arrayHelpers.remove(idx);
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label font-13">
                                                            {item.label}
                                                        </label>
                                                        {item.submenu?.length > 0 && (
                                                            <ul className="my-2">
                                                                {item.submenu.map((submenu, subindex) => (
                                                                    <li className='col-12 form-check-label font-13' key={subindex}>
                                                                        {submenu.label}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    />
                                    <ErrorMessage name='selectedModules' component="div" className="text-start errorText" />
                                </div>
                            </div>
                        </div>
                        <div className='col-12 pt-2 text-center'>
                            <button type="button" className='CancelBtn me-2' onClick={hidePopup}>Cancel</button>
                            <button type="submit" className='SuccessBtn'>
                                {addEditFlag == 1 ? 'Save' : 'Update'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
