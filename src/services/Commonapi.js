import api from "./api";

export const BindUserRole = async () => {
    try {
        const response = await api.post("/Masters/GetMasterRole", {})
        return response.data;
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
        return response.data;
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
        return response.data;
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
        return response.data;
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
        return response.data;
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
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}