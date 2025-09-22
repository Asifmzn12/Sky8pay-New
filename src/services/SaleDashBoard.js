import api from "./api";

export const GetSaleDashBoard = async (payload = {}) => {
    try {                
        const response = await api.post("/DashBoard", payload);
        return response.data;
    } catch (error) {
        console.error("Error fetching sales dashboard", error);
        throw error;
    }
};

