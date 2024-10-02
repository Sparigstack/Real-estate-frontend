import { useCallback } from "react";
import Cookies from 'js-cookie';
import { Logout } from "../utils/js/Common";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const useApiService = () => {
    const createHeaders = (headerflag) => {
        const token = Cookies.get('authToken');
        if (headerflag == 1) { //without content-type for csv
            const headers = new Headers();
            headers.append("Access-Control-Allow-Origin", "*");
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
        else if (headerflag == 2) { //without authorization
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            headers.append("Access-Control-Allow-Origin", "*");
            return headers;
        }
        else {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            headers.append("Access-Control-Allow-Origin", "*");
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    };

    const handleResponse = async (response) => {
        const responseBody = await response.text();
        if (response?.status == 401) {
            alert('Token expired. Redirecting to the login page.');
            setTimeout(() => {
                Logout();
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

    const apiRequest = useCallback(async (method, endpoint, headerflag, data = null) => {
        const requestOptions = {
            method,
            headers: createHeaders(headerflag),
            redirect: "follow",
            ...(data && { body: data }),
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
            return await handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }, [BASE_URL]);

    const postAPI = useCallback((endpoint, data = null, headerflag) => apiRequest('POST', endpoint, headerflag, data), [apiRequest]);
    const getAPI = useCallback((endpoint, headerflag) => apiRequest('GET', endpoint, headerflag), [apiRequest]);

    return {
        postAPI,
        getAPI
    };
};
export default useApiService;