
import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";


export const doAdminLogin = async (payload = {}) => {
    try {
        const response = await api.post("/Auth/AdminAuth", payload);
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

export const DoAdminLogout = async () => {
    try {
        const response = await api.post("/Auth/Logout", {});
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}