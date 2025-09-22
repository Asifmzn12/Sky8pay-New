import api from "./api";

export const GetSettledWallet = async (payload = {}) => {
    try {        
        const response = await api.post("/Accounting/GetSettledWallet", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch settled credit", error);
        throw error;
    }
}