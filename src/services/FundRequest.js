import api from "./api";

export const BindFundRequest = async (payload = {}) => {
    try {
        const response = await api.post("/ManageFund/FundRequestData", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch fund request", error);
        throw error;
    }
}


export const UpdatePendingFundRequest = async (payload = {}) => {
    try {
        console.log(payload);
        const response = await api.post("/ManageFund/UpdateFundRequest", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch update pending data", error);
        throw error;
    }
}
