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
        console.log(fields[key]);
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
      
      console.log(type);

      switch(type){
        case "file":
          setValues({
            ...fields,
            [event.target.id]: {"type": type, "value": event.target.files[0]}
          });
          break;
        case "date":
          const [id, tag] = event.target.id.split("_");
          let currentDate = fields[id].value;
          currentDate[tag] = event.target.value;
          setValues({
            ...fields,
            [id]: {"type": type, "value": currentDate}
          });
          break;
        case "select":
          const currentOptions = fields[event.target.id].options;
          console.log(event.target.value)
          setValues({
            ...fields,
            [event.target.id]: {"type": type, "value": event.target.value, "options": currentOptions}
          });
          break;
        default:
          setValues({
            ...fields,
            [event.target.id]: {"type": type, "value": event.target.value}
          });
      }
    }
  ];
}
