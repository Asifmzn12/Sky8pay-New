import api from "./api";

export const GetsettledPayinReport = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetsettledPayinReport", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch settled payin report", error);
        throw error;
    }
}

export const GetsettledPayinLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetsettledPayinLedgerReport", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch settled payin ledger", error);
        throw error;
    }
}