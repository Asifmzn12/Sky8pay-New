// import React, { createContext, useContext, useEffect, useState } from "react";
// import {
//     setAccessToken,
//     getAccessToken,
//     setRefreshToken,
//     getRefreshToken,
//     clearTokens
// } from '../services/AuthStore';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(getAccessToken());
//     const [refreshToken, setRefresh] = useState(getRefreshToken());

//   useEffect(() => {
//     setToken(getAccessToken());
//     setRefresh(getRefreshToken());
//   }, []);
//     const login = (newToken, newRefreshToken) => {                
//         console.log(newToken);
//         console.log(newRefreshToken);
//         setToken(newToken);
//         setAccessToken(newToken);
//         if (newRefreshToken) {
//             setRefresh(newRefreshToken);
//             setRefreshToken(newRefreshToken);
//         }
//     };
//     const refreshTokenValue = (newRefreshToken) => {
//         setRefresh(newRefreshToken);
//         setRefreshToken(newRefreshToken);
//     };

//     const logout = () => {
//         clearTokens();
//         setToken(null);
//         setRefresh(null);
//     };


//     return (
//         <AuthContext.Provider value={{ token, refreshToken, login, refreshTokenValue, logout }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = () => useContext(AuthContext);


