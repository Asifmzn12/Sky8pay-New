import api from "./api";

export const GetLoanLedger=async(payload={})=>{
    try{
        const response=await api.post("/ManageLoan/GetLoanLedger",payload);
        return response.data;
    }catch(error){
        console.log("Error fetch loan ledger",error);
        throw error;
    }
}