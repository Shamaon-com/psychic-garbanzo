import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
      if (event.target.id === "image") {
        setValues({
          ...fields,
          [event.target.id]: event.target.files,
        });
      } else {
        setValues({
          ...fields,
          [event.target.id]: event.target.value,
        });
      }
    },
  ];
}
