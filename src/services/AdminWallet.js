import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const DoCreditYourSelf = async (payload = {}) => {
    try {
        const response = await api.post("AdminWallet/CreditYourSelf", payload);
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

export const DoDebitYourSelf = async (payload = {}) => {
    try {
        const response = await api.post("AdminWallet/DebitYourSelf", payload);
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

export const GetLifeTimeCommission = async () => {
    try {
        const response = await api.post("AdminWallet/getLifeTimeCommission", {});
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

export const GetAdminProfit = async (payload) => {
    try {
        const response = await api.post("AdminWallet/GetAdminProfit", payload);
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

export const GetLiveEarnCommission = async (payload) => {
    try {
        const response = await api.post("AdminWallet/GetLiveEarnCommission", payload);
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

export const GetApiWiseCommisson = async (payload) => {
    try {
        const response = await api.post("AdminWallet/GetApiWiseCommission", payload);
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

export const GetManualCommission = async (payload) => {
    try {
        const response = await api.post("AdminWallet/GetManualCommission", payload);
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

export const SaveManualCommission = async (payload) => {
    try {
        const response = await api.post("AdminWallet/SaveManualPayinCommissoin", payload);
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

export const GetManualCommissionLedger = async (payload) => {
    try {
        const response = await api.post("AdminWallet/GetManualPayinCommissoinLedger", payload);
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