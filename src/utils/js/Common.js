import Cookies from 'js-cookie';
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

export function formatCurrency(amount) {
    if (amount >= 10000000) {
        return (amount / 10000000).toFixed(1) + ' Cr';
    } else if (amount >= 100000) {
        return (amount / 100000).toFixed(1) + ' L';
    } else {
        return amount.toString();
    }
}

