import api from "./api";

export const BindFundRequest = async (payload = {}) => {
    try {        
        const response = await api.post("/ManageFund/FundRequestData", payload);        
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}


export const UpdatePendingFundRequest = async (payload = {}) => {
    try {
        console.log(payload);
        const response = await api.post("/ManageFund/UpdateFundRequest", payload);
        return response.data;
    } catch (error) {
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}
