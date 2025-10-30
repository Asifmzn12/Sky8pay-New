
import api from "./api";


export const doAdminLogin = async (payload = {}) => {    
    try {
        const response = await api.post("/Auth/AdminAuth", payload);
        if (response.data.statuscode === 200) {            
            return response.data;
        } else {
            return response.data;
        }
    } catch (error) {
        console.log(error);
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