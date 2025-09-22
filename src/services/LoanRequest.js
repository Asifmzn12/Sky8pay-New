import api from "./api";

export const BindLoanRequest = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/GetUserLoanRequest", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch loan request", error);
        throw error;
    }
}

export const BindLoanHistory = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/GetUserLoanDetails", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch loan history", error);
        throw error;
    }
}

export const UpdateLoanRequest = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/UpdatePendingLoan", payload);
        return response.data;
    }
    catch (error) {
        console.log("Error fetch update loan request", error);
        throw error;
    }
}

export const UserLoanRecovered = async (payload = {}) => {
    try {
        console.log(payload);
        const response = await api.post("/ManageLoan/LoanRecovered", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch update loan recovered", error);
    }
}

export const UserLifeTimeLoanReport = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/LifeTimeLoanReport", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch life time report", error);
        throw error;
    }
}