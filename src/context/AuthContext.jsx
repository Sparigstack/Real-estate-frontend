import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Login from '../pages/Signup-Login/Login';
import useApiService from '../hooks/useApiService';
import AlertComp from '../components/alerts/AlertComp';
import Loader from '../components/loader/Loader';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState(Cookies.get('authToken') || null);
    const [userId, setUserId] = useState(Cookies.get('userId') || null);
    const [loading, setloading] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const [userDetails, setUserDetails] = useState({
        userName: '',
        companyname: '',
        client_id: '',
        client_secret_key: ''
    });
    const { getAPIAuthKey, postAPIAuthKey } = useApiService();

    useEffect(() => {
        if (authToken && userId) {
            Cookies.set('authToken', authToken, { expires: 1 });
            Cookies.set('userId', userId, { expires: 1 });
            getUserDetails();
        } else {
            Cookies.remove('authToken');
            Cookies.remove('userId');
        }
    }, [authToken, userId]);

    const getUserDetails = async () => {
        try {
            const result = await getAPIAuthKey(`/get-user-details/${userId}`);
            if (!result) throw new Error('Something went wrong');
            const response = JSON.parse(result);
            setUserDetails({
                userName: response?.message?.name || '',
                companyname: response?.message?.company_detail?.name,
                client_id: response?.message?.client_id,
                client_secret_key: response?.message?.client_secret_key
            });
        } catch (error) {
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            setloading(true);
            const result = await postAPIAuthKey('/logout');
            if (!result) {
                throw new Error('Something went wrong');
            }
            setShowAlerts(<AlertComp show={true} variant={'success'} message={'Logout Successfully.'} />);
            Cookies.remove('authToken');
            Cookies.remove('userId');
            Cookies.remove('schemeId');
            setTimeout(() => {
                setShowAlerts(false);
                setUserDetails({ userName: '', email: '', client_id: '', client_secret_key: '' });
                setloading(false);
                setAuthToken(null);
                setUserId(null);
                navigate("/");
            }, 2000);

        }
        catch (error) {
            setloading(false);
            console.error(error);
        }
    };

    return (
        <>
            {showAlerts}
            {loading && <Loader runningcheck={loading} />}
            <AuthContext.Provider value={{ authToken, userDetails, setUserDetails, logout, setAuthToken, setUserId }}>
                {authToken ? children : <Login />}
            </AuthContext.Provider>
        </>
    );
};

export default AuthContext;

