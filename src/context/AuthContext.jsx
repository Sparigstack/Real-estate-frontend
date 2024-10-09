import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Login from '../pages/Signup-Login/Login';
import useApiService from '../hooks/useApiService';
import ShowLoader from '../components/loader/ShowLoader';
import AlertComp from '../components/alerts/AlertComp';
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
        email: '',
        client_id: '',
        client_secret_key: ''
    });
    const { getAPI, postAPI } = useApiService();

    useEffect(() => {
        if (authToken && userId) {
            Cookies.set('authToken', authToken, { expires: 1, secure: true, sameSite: 'Strict' });
            Cookies.set('userId', userId, { expires: 1, secure: true, sameSite: 'Strict' });
            getUserDetails();
        } else {
            Cookies.remove('authToken');
            Cookies.remove('userId');
        }
    }, [authToken, userId]);

    const getUserDetails = async () => {
        try {
            const result = await getAPI(`/get-user-details/${userId}`, 3);
            if (!result) throw new Error('Something went wrong');
            const response = JSON.parse(result);
            setUserDetails({
                userName: response?.msg?.name || '',
                email: response?.msg?.email,
                client_id: response?.msg?.client_id,
                client_secret_key: response?.msg?.client_secret_key
            });
        } catch (error) {
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            setloading(true);
            const result = await postAPI('/logout');
            if (!result) {
                throw new Error('Something went wrong');
            }
            console.log("logout")
            const responseRs = JSON.parse(result);
            setShowAlerts(<AlertComp show={true} variant={'success'} message={'Logout Successfully!!'} />);
            if (responseRs.status == 'success') {
                setTimeout(() => {
                    setShowAlerts(<AlertComp show={false} />);
                    setloading(false);
                    setAuthToken(null);
                    setUserId(null);
                    setUserDetails({ userName: '', email: '', client_id: '', client_secret_key: '' });
                    navigate("/");
                }, 2000);
            }
            else {
                setShowAlerts(<AlertComp show={false} />);
                setloading(false);
                setAuthToken(null);
                setUserId(null);
                setUserDetails({ userName: '', email: '', client_id: '', client_secret_key: '' });
                navigate("/");

            }
        }
        catch (error) {
            setloading(false);
            console.error(error);
        }
    };

    return (
        <>
            {showAlerts}
            {loading && <ShowLoader />}
            <AuthContext.Provider value={{ authToken, userDetails, setUserDetails, logout, setAuthToken, setUserId }}>
                {authToken ? children : <Login />}
            </AuthContext.Provider>
        </>
    );
};

export default AuthContext;

