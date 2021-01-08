import { Auth } from "aws-amplify";
import { createContext } from "react";



export const AuthContext = createContext({
    isLoggedIn: false,
    userData: null,
    login: () => {},
    logout: () => {}
});


export const capitalize = (str) => {
    if(typeof str === 'string') {
        return str.replace(/^\w/, c => c.toUpperCase());
    } else {
        return '';
    }
};