import React, { createContext, useEffect, useState } from 'react'
import useApiService from '../services/ApiService';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
export const UserContext = createContext();
export default function UserProvider({ children }) {
    const userId = Cookies.get('userId');
    const token = Cookies.get('authToken');
    const propertyId = Cookies.get('propertyId');
    const navigate = useNavigate();
    const { getAPI } = useApiService();
    const [userDetails, setUserDetails] = useState({
        userName: '',
        email: '',
        client_id: '',
        client_secret_key: ''
    });
    const [propertyName, setpropertyName] = useState('');
    useEffect(() => {
        if (token) {
            getUserDetails();
        }
    }, [token,])
    useEffect(() => {
        if (propertyId) {
            getPropertyData();
        } else {
            navigate('/properties');
        }
    }, [propertyId])
    const getUserDetails = async () => {
        try {
            const result = await getAPI(`/get-user-details/${userId}`, 3);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setUserDetails({
                ...userDetails,
                userName: responseRs?.msg?.name || '',
                email: responseRs?.msg?.email,
                client_id: responseRs?.msg?.client_id,
                client_secret_key: responseRs?.msg?.client_secret_key
            })
        }
        catch (error) {
            console.error(error);
        }
    }
    const getPropertyData = async () => {
        try {
            const result = await getAPI(`/get-property-details/${propertyId}`, 3);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setpropertyName(responseRs.name)
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <UserContext.Provider value={{ userDetails, setUserDetails, propertyName }}>
            {children}
        </UserContext.Provider>
    )
}
