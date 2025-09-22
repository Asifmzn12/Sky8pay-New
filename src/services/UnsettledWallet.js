import api from "./api";

export const GetUnsettledWallet = async (payload = {}) => {
    try {        
        const response = await api.post("/Accounting/GetUnsettledWallet", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch settled credit", error);
        throw error;
    }
}