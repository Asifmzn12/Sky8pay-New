import api from "./api";

export const BindUserBankList = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetUserBankMaster", payload);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const SaveUpdateBankMaster = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/SaveUpdateBankMaster", payload);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const DeleteBankDetails = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/DeleteBankMaster", payload);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}