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


export function useModalFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
      
      let type = fields[event.target.id].type;

      if(type==="file"){
        setValues({
          ...fields,
          [event.target.id]: {"type": type, "value": event.target.file}
        });
      }else{
      setValues({
          ...fields,
          [event.target.id]: {"type": type, "value": event.target.value}
        });
      }
    }
  ];
}
