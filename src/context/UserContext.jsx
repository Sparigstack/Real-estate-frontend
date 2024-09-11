import React, { createContext, useEffect, useState } from 'react'
import ShowLoader from '../components/loader/ShowLoader';
import HideLoader from '../components/loader/HideLoader';
import useApiService from '../services/ApiService';
import Cookies from "js-cookie";

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const userId = localStorage.getItem('userId');
    const [userDetails, setUserDetails] = useState({
        userName: '',
        contactNum: '',
        companyName: '',
        companyEmail: '',
        companyContactNum: '',
        companyAddress: '',
        companyLogo: ''
    });
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('authToken');
    const { getAPI } = useApiService();
    const [uploadedFileBase64, setUploadedFileBase64] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');

    useEffect(() => {
        if (token) {
            getUserDetails();
        }
    }, [token])
    const getUserDetails = async () => {
        setLoading(true);
        try {
            const result = await getAPI(`/user-profile/${userId}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setLoading(false);
                setUserDetails({
                    ...userDetails,
                    userName: responseRs?.msg?.user?.name || '',
                    contactNum: responseRs?.msg?.user?.contact_no || '',
                    companyName: responseRs?.msg?.name || '',
                    companyEmail: responseRs?.msg?.email || '',
                    companyContactNum: responseRs?.msg?.contact_no || '',
                    companyAddress: responseRs?.msg?.address || '',
                    companyLogo: responseRs?.msg?.logo || '',
                })
                if (responseRs?.msg?.logo) {
                    setUploadedFileBase64(responseRs?.msg?.logo);
                    setUploadedFileName('');
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <UserContext.Provider value={{ userDetails, setUserDetails, uploadedFileBase64, setUploadedFileBase64, uploadedFileName, setUploadedFileName }}>
                {children}
            </UserContext.Provider>
        </>
    )
}
