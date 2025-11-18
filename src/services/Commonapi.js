import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const BindUserRole = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetMasterRole", payload)
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    }
    catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const BindUserListByRoleId = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetCustomerDetailsDropdown", payload);
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

export const BindInActiveUserListByRoleId = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetInActiveCustomerDetailsDropdown", payload);
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

export const BindMasterData = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetMasterData", payload);
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
export const BindAPI = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetAllAPIList", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
};

export const BindAPIListByServiceName = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetAPIListByServiceName", payload);
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

export const GetServiceList = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetServiceList", payload);
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


const allowOnlyNumber = (e) => {
    const allowd = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"];
    if (allowd.includes(e.key))
        return;
    if (!/^[0-9.]$/.test(e.key))
        e.preventDefault();
}