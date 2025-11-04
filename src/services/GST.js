import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const GetGSTReport = async (payload) => {
    try {
        const response = await api.post("GST/GetGSTReport", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else if (error.response.data.status === 400) {
            return { statuscode: 400, message: error.response.data.title }
        }
        else {
            return error.response.data;
        }
    }
}

export const SavePayGst = async (payload) => {
    try {
        const response = await api.post("GST/SavePayGst", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else if (error.response.data.status === 400) {
            return { statuscode: 400, message: error.response.data.title }
        }
        else {
            return error.response.data;
        }
    }
}

export const GetGstLedger = async (payload) => {
    try {
        const response = await api.post("GST/GetGSTLedger", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else if (error.response.data.status === 400) {
            return { statuscode: 400, message: error.response.data.title }
        }
        else {
            return error.response.data;
        }
    }
}

export const SaveUserWiseGst = async (payload) => {
    try {
        const response = await api.post("GST/PaidUserWiseGst", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else if (error.response.data.status === 400) {
            return { statuscode: 400, message: error.response.data.title }
        }
        else {
            return error.response.data;
        }
    }
}

export const GetUserWiseGst = async (payload) => {
    try {
        const response = await api.post("GST/GetUserWiseGst", payload);
        const realresponse = decryptValue(response.data.data);        
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else if (error.response.data.status === 400) {
            return { statuscode: 400, message: error.response.data.title }
        }
        else {
            return error.response.data;
        }
    }
}