import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const GetPayoutReports = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/GetPayoutReport", payload);
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

export const GetPayoutInvoiceLink = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/GeneratePayoutInvoice", payload);
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

export const CheckStatusTransaction = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/CheckStatus", payload);
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

export const GetPayoutLedger = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/PayoutLedger", payload);
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

export const GetGarbagePayout = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/GarbagePayoutReport", payload);
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