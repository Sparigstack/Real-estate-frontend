import Cookies from "js-cookie";
import useApiService from "../../services/ApiService"; 
export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

export function Logout() {
    Cookies.remove('authToken');
    Cookies.remove('userId');
    window.location.href = '/login';
}
export const getPropertyTypes = async (flag, setPropertyTypeArray) => {
    const {  getAPI } = useApiService();
    try {
        const result = await getAPI(`/get-property-types/${flag}`);
        if (!result || result == "") {
            alert('Something went wrong');
        }
        else {
            const responseRs = JSON.parse(result);
            setPropertyTypeArray(responseRs)
        }
    }
    catch (error) {
        console.error(error);
    }
}