import api from "./api";

export const BindUserBankList = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetUserBankMaster", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch user bank list data", error);
        throw error;
    }
}

export const SaveUpdateBankMaster = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/SaveUpdateBankMaster", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch save and update bank details", error);
        throw error;
    }
}

export const DeleteBankDetails = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/DeleteBankMaster", payload);
        return response.data;
    } catch (error) {
        console.log("Error deleted bank", error);
        throw error;
    }
}