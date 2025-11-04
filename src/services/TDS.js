import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const GetTDSReport = async (payload) => {
    try {
        const response = await api.post("TDS/GetTdsReport", payload);
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

export const SavePayTDS = async (payload) => {
    try {
        const response = await api.post("TDS/SavePayTDS", payload);
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

export const GetTDSLedger = async (payload) => {
    try {
        const response = await api.post("TDS/GetTdsLedger", payload);
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

export const SaveUserWiseTds = async (payload) => {
    try {
        const response = await api.post("TDS/PaidUserWiseTds", payload);
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


export const GetUserWiseTds = async (payload) => {
    try {
        const response = await api.post("TDS/GetUserWiseTds", payload);
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
