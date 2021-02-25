
import { createContext } from "react";
import { Storage } from "aws-amplify";


export  const AuthContext = createContext({
    isLoggedIn: false,
    isAdmin: false,
    attributes: {},
    pageSettings: {}
  });


export const capitalize = (str) => {
    if(typeof str === 'string') {
        return str.replace(/^\w/, c => c.toUpperCase());
    } else {
        return '';
    }
};



export const uploadToS3 = async (file, setLoaded) => {

    await Storage.put(file.name.replace(/\s+/g, ''), file, {
      contentType: file.type,
      level: 'public',
    }).then((result) => {
      console.log(result);
      setLoaded(false);
    }).catch((err) => {
      alert(err);
      setLoaded(false);
    })
  }

  export const validate = (fields) => {
    for (var field in fields) {
      if (fields[field].value === "") {
        alert("Rellene todos los campos " + field);
        return false;
      }
    }
    return true;
  };
