import api from "./api";

export const SaveUpdateCommissionPackage = async (payload = {}) => {
    try {
        const response = await api.post("/Commission/SaveUpdateCommissionPackage", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch save and update commission package details", error);
        throw error;
    }
}

export const GetCommissionPackage = async (payload = {}) => {
    try {
        const response = await api.post("/Commission/GetCommissionPackage", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch get commission package details", error);
        throw error;
    }
}

export const GetCommissionLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Commission/GetCommissionLedger", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch get commission ledger", error);
        throw error;
    }
}