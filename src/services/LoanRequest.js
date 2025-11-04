import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const BindLoanRequest = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/GetUserLoanRequest", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const BindLoanHistory = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/GetUserLoanDetails", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const UpdateLoanRequest = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/UpdatePendingLoan", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    }
    catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const UserLoanRecovered = async (payload = {}) => {
    try {
        console.log(payload);
        const response = await api.post("/ManageLoan/LoanRecovered", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}

export const UserLifeTimeLoanReport = async (payload = {}) => {
    try {
        const response = await api.post("/ManageLoan/LifeTimeLoanReport", payload);
        const realresponse = decryptValue(response.data.data);
        return JSON.parse(realresponse);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}