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
      
      let type = fields[event.target.id.split("_")[0]].type;
      
      switch(type){
        case "file":
          setValues({
            ...fields,
            [event.target.id]: {"type": type, "value": event.target.files[0]}
          });
          break;
        case "date":
          let id = event.target.id.split("_")[0];
          let tag = event.target.id.split("_")[1];
          let currentDate = fields[id].value;
          console.log(currentDate)
          currentDate[tag] = event.target.value;
          setValues({
            ...fields,
            [id]: {"type": type, "value": currentDate}
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
