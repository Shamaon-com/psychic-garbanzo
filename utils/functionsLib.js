
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



export const uploadToS3 = async (file) => {

    Storage.put(file.name.replace(/\s+/g, ''), file, {
      contentType: file.type,
    }).then((result) => {
      console.log(result);
    }).catch((err) => {
      alert(err);
    })
  }

  export const validate = () => {
    for (var field in fields) {
      if (fields[field] === "") {
        alert("Rellene todos los campos");
        return false;
      }
    }
    return true;
  };
