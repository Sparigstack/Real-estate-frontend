import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const useApiService = () => {
    const navigate = useNavigate();
    const createHeaders = () => {
        // const token = accessToken
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Access-Control-Allow-Origin", "*");
        // headers.append("Authorization", token);
        return headers;
    };

    const handleResponse = async (response) => {
        const responseBody = await response.text();
        if (response?.status == 401) {
            alert('Token expired. Redirecting to the login page.');
            setTimeout(() => {
                navigate('/');
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

    const apiRequest = useCallback(async (method, endpoint, data = null) => {
        const requestOptions = {
            method,
            headers: createHeaders(),
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

    const postAPI = useCallback((endpoint, data = null) => apiRequest('POST', endpoint, data), [apiRequest]);
    const getAPI = useCallback((endpoint) => apiRequest('GET', endpoint), [apiRequest]);
		
    return {
        postAPI,
        getAPI
    };
};
export default useApiService;