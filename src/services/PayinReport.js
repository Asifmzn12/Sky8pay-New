import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const GetUnsettledPayinReport = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetUnsettledPayinReport", payload);
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
export const GetPayinInvoiceLink = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GeneratePayinInvoice", payload);
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

export const GetUnsettledPayinLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/GetUnsettledPayinLedgerReport", payload);
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

export const PayinCheckStatusTransaction = async (payload = {}) => {
    try {
        const response = await api.post("/Payin/CheckStatus", payload);
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