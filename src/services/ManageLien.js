import api from "./api";

export const SubmitLienData = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/SaveLienData", payload);
        return response.data;
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
        const response = await api.post("/ManageCustomers/GetLienData", payload);
        return response.data;
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
        const response = await api.post("/ManageCustomers/DeleteLien", payload);
        return response.data;
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
        const response = await api.post("/ManageCustomers/GetDeletedLien", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}