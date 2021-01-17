
import { createContext } from "react";
import { CognitoUser } from '@aws-amplify/auth';




export  const AuthContext = createContext({
    isLoggedIn: false,
    isAdmin: false,
    attributes: {},
    login: (username: string, password: string) => {},
    logout: () => {}
  });


export const capitalize = (str) => {
    if(typeof str === 'string') {
        return str.replace(/^\w/, c => c.toUpperCase());
    } else {
        return '';
    }
};