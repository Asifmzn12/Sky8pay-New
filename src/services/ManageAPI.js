import api from "./api";

export const GetGivenApiProfit = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetGivenApiProfit", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch given profit", error);
        throw error;
    }
}

export const GetApiFund = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiFund", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch api fund", error);
        throw error;
    }
}

export const SaveApiFund = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveAPIFund", payload);
        return response.data;
    } catch (error) {
        console.log("Error saved api fund data ", error);
        throw error;
    }
}