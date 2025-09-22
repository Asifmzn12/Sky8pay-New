import api from "./api";

export const SubmitLienData = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/SaveLienData", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch submitted daata", error);
        throw error;
    }
}

export const GetLienData = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetLienData", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch get lien data", error);
        throw error;
    }
}

export const DeleteUserLien = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/DeleteLien", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch delete user lien", error);
        throw error;
    }
}

export const GetDeletedLien = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetDeletedLien", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch deleted data", error);
        throw error;
    }
}