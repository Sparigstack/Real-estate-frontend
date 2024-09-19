import React, { createContext, useEffect, useState } from 'react'
import ShowLoader from '../components/loader/ShowLoader';
import HideLoader from '../components/loader/HideLoader';
import useApiService from '../services/ApiService';
import Cookies from "js-cookie";

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const userId = Cookies.get('userId');
    const token = Cookies.get('authToken');
    const { getAPI } = useApiService();
    const [userDetails, setUserDetails] = useState({
        userName: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (token) {
            getUserDetails();
        }
    }, [token])
    const getUserDetails = async () => {
        setLoading(true);
        try {
            const result = await getAPI(`/get-user-details/${userId}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                setLoading(false);
                setUserDetails({
                    ...userDetails,
                    userName: responseRs?.msg?.name || '',
                    email: responseRs?.msg?.email
                })
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {loading ? <ShowLoader /> : <HideLoader />}
            <UserContext.Provider value={{ userDetails, setUserDetails }}>
                {children}
            </UserContext.Provider>
        </>
    )
}
