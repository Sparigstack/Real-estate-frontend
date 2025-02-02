import useApiService from "./useApiService";
import useProperty from "./useProperty";

const useCommonApiService = () => {
    const { getAPI, getAPIAuthKey } = useApiService();
    const { schemeId } = useProperty();
    const getSources = async () => {
        try {
            const result = await getAPI(`/get-sources`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            return responseRs;
        }
        catch (error) {
            console.error(error);
        }
    }

    const getAllStates = async () => {
        try {
            const result = await getAPIAuthKey(`/get-state-details`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                return responseRs;
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const getCities = async (stateid) => {
        try {
            const result = await getAPIAuthKey(`/get-state-with-cities-details/${stateid}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                return responseRs?.cities;
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const getArea = async (userId, cityid) => {
        try {
            const result = await getAPIAuthKey(`/get-area-with-cities-details/${userId}/${cityid}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                return responseRs
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const getPaymentTypes = async () => {
        try {
            const result = await getAPIAuthKey(`/get-payment-types`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                return responseRs
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const getLeadStatus = async () => {
        try {
            const result = await getAPI(`/get-lead-statuses`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                return responseRs
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const getLeadTags = async () => {
        try {
            const result = await getAPIAuthKey(`/fetch-tags/${schemeId}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                return responseRs
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const getUserMenuAccess = async (userid) => {
        try {
            const result = await getAPIAuthKey(`/get-user-menu-access/${userid}`);
            if (!result || result == "") {
                alert('Something went wrong');
            }
            else {
                const responseRs = JSON.parse(result);
                return responseRs
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return {
        getSources,
        getAllStates,
        getCities,
        getArea,
        getPaymentTypes,
        getLeadStatus,
        getLeadTags,
        getUserMenuAccess
    };
}
export default useCommonApiService;
