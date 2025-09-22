import api from "./api";

export const BindUserRole = async () => {
    try {
        const response = await api.post("/Masters/GetMasterRole", {})
        return response.data;
    }
    catch (error) {
        console.log("Error fetch user role data ", error);
        throw error;
    }
}

export const BindUserListByRoleId = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetCustomerDetailsDropdown", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch user list data", error);
        throw error;
    }
}

export const BindMasterData = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetMasterData", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch status master", error);
        throw error;
    }
}
export const BindAPI = async (payload = {}) => {
    try {        
        const response = await api.post("/Masters/GetAllAPIList", payload);                
        return response.data;
    } catch (error) {
        console.error("Error fetch api detail", error);
        throw error;
    }
};

export const BindAPIListByServiceName = async (payload = {}) => {
    try {
        const response = await api.post("/Masters/GetAPIListByServiceName", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch api detail by service name ", error);
    }
}