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

export function DDMMYYYY(date) {
    var d = new Date(date);
    var curr_year = d.getFullYear();
    var curr_month = (d.getMonth() + 1).toString().padStart(2, "0");
    var curr_date = d.getDate().toString().padStart(2, "0");
    var newDate = curr_date + "-" + curr_month + "-" + curr_year;
    return newDate;
}

export function YYYYMMDD(date) {
    var d = new Date(date);
    var curr_year = d.getFullYear();
    var curr_month = (d.getMonth() + 1).toString().padStart(2, "0");
    var curr_date = d.getDate().toString().padStart(2, "0");
    var newDate = curr_year + "-" + curr_month + "-" + curr_date; // Format for HTML date input
    return newDate;
}


export function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}  : ${seconds.toString().padStart(2, '0')} `;
};

export const isNumeric = (str) => {
    return !isNaN(str) && !isNaN(parseFloat(str));
};

export const isAlpha = (str) => {
    return /^[a-zA-Z]+$/.test(str);
};