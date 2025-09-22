import api from "./api";

export const GetUnsettledPayinReport = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetUnsettledPayinReport", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch unsettled payin report", error);
        throw error;
    }
}
export const GetPayinInvoiceLink = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GeneratePayinInvoice", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch payin invoice link", error);
        throw error;
    }
}

export const GetUnsettledPayinLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetUnsettledPayinLedgerReport", payload);
        return response.data;
    } catch (error) {
        console.log("Erro fetch payin ledger", error);
        throw error;
    }
}

export const PayinCheckStatusTransaction = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/CheckStatus", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch payin check status", error);
    }
}