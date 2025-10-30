import api from "./api";

export const SearchPayin = async (payload = {}) => {
    try {
        const response = await api.post("/Search/GetPayinSearch", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const SearchPayout = async (payload = {}) => {
    try {
        const response = await api.post("/Search/GetPayoutSearch", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const UpdatePendingPayin = async (payload = {}) => {
    try {
        const response = await api.post("/Search/UpdatePendingPayin", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const UpdatePendingPayout = async (payload = {}) => {
    try {
        const response = await api.post("/Search/UpdatePendingPayout", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetTopPayinTxn = async (payload = {}) => {
    try {        
        const response = await api.post("/Search/GetTopPayinTxn", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}