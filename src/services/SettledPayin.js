import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const GetsettledPayinReport = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetsettledPayinReport", payload);
        const realresponse = decryptValue(response.data.data);        
        return JSON.parse(realresponse);       
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetsettledPayinLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetsettledPayinLedgerReport", payload);
        const realresponse = decryptValue(response.data.data);        
        return JSON.parse(realresponse);       
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}