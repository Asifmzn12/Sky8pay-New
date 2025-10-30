import api from "./api";

export const GetUnsettledPayinReport = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetUnsettledPayinReport", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}
export const GetPayinInvoiceLink = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GeneratePayinInvoice", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetUnsettledPayinLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetUnsettledPayinLedgerReport", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const PayinCheckStatusTransaction = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/CheckStatus", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}