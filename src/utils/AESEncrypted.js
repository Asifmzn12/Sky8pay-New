import CryptoJS from "crypto-js";

export const encryptvalue = (token) => {
    const AES_KEY = import.meta.env.VITE_SECRETKEY
    //function encryptCSRFToken(token) {
        const key = CryptoJS.enc.Utf8.parse(AES_KEY);
        const iv = CryptoJS.lib.WordArray.random(16);
        const encrypted = CryptoJS.AES.encrypt(token, key, { iv });
        const combined = iv.concat(encrypted.ciphertext);
        return CryptoJS.enc.Base64.stringify(combined);
    //}
}