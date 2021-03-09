
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



export const uploadToS3 = async (file, setIsUplading) => {
    if(file === undefined || file === null || file === ""){
      alert("Error al cargar imagen")
      return
    }
    await Storage.put(file.name.replace(/\s+/g, ''), file, {
      contentType: file.type,
      level: 'public',
    }).then((result) => {
      console.log(result);
      setIsUplading(false);
    }).catch((err) => {
      alert(err);
      setIsUplading(false);
    })
  }

  export const validate = (fields) => {
    for (var field in fields) {
      console.log(field, fields[field].value)
      if (fields[field].value === "" || (Object.keys(fields[field].value).length === 0 && fields[field].value.constructor === Object)) {
        alert("Rellene todos los campos " + field);
        return false;
      }
    }
    return true;
  };
