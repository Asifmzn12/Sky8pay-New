import api from "./api";

export const SaveUpdateCommissionPackage = async (payload = {}) => {
    try {
        const response = await api.post("/Commission/SaveUpdateCommissionPackage", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetCommissionPackage = async (payload = {}) => {
    try {
        const response = await api.post("/Commission/GetCommissionPackage", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetCommissionLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Commission/GetCommissionLedger", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}