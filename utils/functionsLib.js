
import { createContext } from "react";


export  const AuthContext = createContext({
    isLoggedIn: false,
    isAdmin: false,
    attributes: {},
    pageSettings: {},
    login: (username, password) => {},
    logout: () => {}
  });


export const capitalize = (str) => {
    if(typeof str === 'string') {
        return str.replace(/^\w/, c => c.toUpperCase());
    } else {
        return '';
    }
};