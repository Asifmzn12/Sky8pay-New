import api from "./api";

export const GetGivenApiProfit = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetGivenApiProfit", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch given profit", error);
        throw error;
    }
}

export const GetApiFund = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiFund", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch api fund", error);
        throw error;
    }
}

export const GetApiFundLedger = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiFundLedger", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch api fund", error);
        throw error;
    }
}

export const SaveApiFund = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveAPIFund", payload);
        return response.data;
    } catch (error) {
        console.log("Error saved api fund data ", error);
        throw error;
    }
}

export const SaveApiCompanyDetails = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveApiCompanyDetails", payload);
        return response.data;
    } catch (error) {
        console.log("Error save api company details", error);
        throw error;
    }
}

export const GetApiDetailsById = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiDetailsById", payload);
        return response.data;
    } catch (error) {
        console.log("Error get api details by id", error);
        throw error;
    }
}

export const GetApiCompanyDetails = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiCompanyDetails", payload);
        return response.data;
    } catch (error) {
        console.log("Error get api company details", error);
        throw error;
    }
}

export const DeleteApiCompanyDetails = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/DeleteApiCompanyDetails", payload);
        return response.data;
    } catch (error) {
        console.log("Error delete api company details", error);
        throw error;
    }
}

export const SaveUpdateSlab = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveUpdateSlabDetails", payload);
        return response.data;
    } catch (error) {
        console.log("Error save slab details", error);
        throw error;
    }
}

export const GetSlab = async (payload = {}) => {
    try {        
        const response = await api.post("/ManageAPI/GetSlab", payload);
        return response.data;
    } catch (error) {
        console.log("Error get slab details", error);
        throw error;
    }
}