import { decryptValue } from "../utils/AESEncrypted";
import api from "./api";

export const GetPackageId = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetPackageByRoleId", payload);
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

export const GetUserServiceStatus = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetUserServiceStatus", payload);
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

export const CreateUser = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/CreateUser", payload);
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

export const GetActiveUserList = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetActiveUserList", payload);
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

export const UpdateUser = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/UpdateUser", payload);
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

export const GetAddressByPinCode = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/AddressByPinCode", payload);
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

export const UpdateUserKyc = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/UpdateUserKyc", payload);
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

export const ProfileUpload = async (payload = {}) => {
    try {
        const response = await api.post("/FileUpload/FileUpload", payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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

export const GetUserLoginHistory = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetUserLogiHistory", payload);
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


export const GetInActiveUserList = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetInActiveUserList", payload);
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

export const GetUserWalletList = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetUserWalletList", payload);
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

export const UpdateUserStatus = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/UpdateUserStatus", payload);
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

export const GetReconHistory = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetReconHistory", payload);
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

export const SaveReconHistory = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/SaveReconHistory", payload);
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


export const SaveUplineApiWallet = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/SaveUplineApiWallet", payload);
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


export const GetWalletType = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetWalletList", payload);
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


export const SaveSettledWalletCreditDebit = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/SaveSettledWalletCreditDebit", payload);
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

export const GetCurrentUserWalletBalance = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetCurrentUserWalletBalance", payload);
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

export const SaveUnSettledWalletCreditDebit = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/SaveUnSettledWalletCreditDebit", payload);
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


export const GetUserActiveServices = async (payload = {}) => {
    try {
        const response = await api.post("/ManageCustomers/GetUserActiveServices", payload);
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



