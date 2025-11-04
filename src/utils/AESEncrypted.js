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

export const decryptValue = (encryptedBase64) => {
    const AES_KEY = import.meta.env.VITE_SECRETKEY;
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const combined = CryptoJS.enc.Base64.parse(encryptedBase64);
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4)); // 16 bytes = 4 words
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, { iv });
    return CryptoJS.enc.Utf8.stringify(decrypted);
};
