import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
        setValues({
          ...fields,
          [event.target.id]: event.target.value,
        });
      }
  ];
}

export function setDictValue(initialState) {

  const [fields, setValues] = useState(initialState);
  return [
    fields,
    function (key, value) {
      if(fields[key] !== undefined){
        console.log(key, value)
        setValues({
          ...fields,
          [key]: value,
        });
      }
    }
  ];
}


export function useModalFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
      
      let type = fields[event.target.id.split("_")[0]].type;

      switch(type){
        case "file":
          fields[event.target.id].value = event.target.files[0]
          setValues({...fields});
          break;
        case "date":
          const [id, tag] = event.target.id.split("_");
          let currentDate = fields[id].value;
          currentDate[tag] = event.target.value;
          fields[id].value = currentDate
          setValues({...fields});
          break;
        case "select":
          const currentOptions = fields[event.target.id].options;
          fields[event.target.id].value = event.target.value
          setValues({...fields});
          break;
        default:
          fields[event.target.id].value = event.target.value
          setValues({...fields});
      }
    }
  ];
}
