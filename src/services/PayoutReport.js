import api from "./api";

export const GetPayoutReports = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/GetPayoutReport", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch payout report", error);
        throw error;
    }
}

export const GetPayoutInvoiceLink = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/GeneratePayoutInvoice", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch payout invoice", error);
        throw error;
    }
}

export const CheckStatusTransaction = async (payload = {}) => {
    try {
        const response = await api.post("/Payout/CheckStatus", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch checkstatus payout", error);
        throw error;
    }
}

export const GetPayoutLedger = async (payload = {}) => {
    try {        
        const response = await api.post("/Payout/PayoutLedger", payload);
        return response.data;
    } catch (error) {
        console.log("Error fetch payout ledger", error);
        throw error;
    }
}

export const GetGarbagePayout=async(payload={})=>{
    try{
const response=await api.post("/Payout/GarbagePayoutReport",payload);
return response.data;
    }catch(error){
        console.log("Error fetch garbage payout",error);
        throw error;
    }
}