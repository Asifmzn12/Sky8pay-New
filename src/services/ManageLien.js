import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const SubmitLienData = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLien/SaveLienData", payload);
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

export const GetLienData = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLien/GetLienData", payload);
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

export const DeleteUserLien = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLien/DeleteLien", payload);
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

export const GetDeletedLien = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLien/GetDeletedLien", payload);
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