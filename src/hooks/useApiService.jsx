import { useCallback } from "react";
import useAuth from "./useAuth";
import Cookies from 'js-cookie';

const useApiService = () => {
    const { logout } = useAuth();
    const authToken = Cookies.get('authToken');
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const createHeaders = (useAuthToken, csv) => {
        const headers = new Headers();
        if (!csv) {
            headers.append("Content-Type", "application/json");
        }
        headers.append("Access-Control-Allow-Origin", "*");
        useAuthToken && headers.append("Authorization", `Bearer ${authToken}`);
        return headers;
    };

    const handleResponse = async (response) => {
        const responseBody = await response.text();
        if (response?.status == 401) {
            setTimeout(() => {
                logout();
            }, 2000);
        } else if (!responseBody) {
            alert('Something went wrong');
        }
        return responseBody;
    };

    const handleError = (error) => {
        console.error(error);
        return error;
    };

    const apiRequest = useCallback(async (method, endpoint, data = null, useAuthToken = false, csv = false) => {
        const requestOptions = {
            method,
            headers: createHeaders(useAuthToken, csv),
            redirect: "follow",
            ...(data && { body: data }),
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
            return await handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }, [BASE_URL, authToken]);

    const postAPI = useCallback((endpoint, data = null) => apiRequest('POST', endpoint, data), [apiRequest]);
    const getAPI = useCallback((endpoint) => apiRequest('GET', endpoint), [apiRequest]);
    const postAPIAuthKey = useCallback((endpoint, data = null, csv) => apiRequest('POST', endpoint, data, true, csv), [apiRequest]);
    const getAPIAuthKey = useCallback((endpoint, data = null) => apiRequest('GET', endpoint, data, true), [apiRequest]);

    return {
        postAPI,
        getAPI,
        postAPIAuthKey,
        getAPIAuthKey
    };
};
export default useApiService;