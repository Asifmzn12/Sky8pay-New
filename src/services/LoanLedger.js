import api from "./api";

export const GetLoanLedger=async(payload={})=>{
    try{
        console.log(payload);
        const response=await api.post("/ManageLoan/GetLoanLedger",payload);
        return response.data;
    }catch(error){
         if (error.code === "ERR_NETWORK") {
            return { statuscode: 502, message: error.message }
        } else {
            return error.response.data;
        }
    }
}