import api from "./api";

export const GetGivenApiProfit = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetGivenApiProfit", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetApiFund = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiFund", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetApiFundLedger = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiFundLedger", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const SaveApiFund = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveAPIFund", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const SaveApiCompanyDetails = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveApiCompanyDetails", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetApiDetailsById = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiDetailsById", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetApiCompanyDetails = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetApiCompanyDetails", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const DeleteApiCompanyDetails = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/DeleteApiCompanyDetails", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const SaveUpdateSlab = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveUpdateSlabDetails", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetSlab = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetSlab", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetSwitchPayin = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetSwitchPayin", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const SaveUpdatePayoutLimit = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/SaveUpdatePayoutLimit", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetPayoutLimit = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetPayoutMinMaxLimit", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const DeletePayoutMinMax = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/DeletePayoutMinMax", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const GetInstantPayinSetup = async (payload = {}) => {
    try {
        const response = await api.post("/ManageAPI/GetInstantPayinAPISwitching", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}