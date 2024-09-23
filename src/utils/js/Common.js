import Cookies from "js-cookie";
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
