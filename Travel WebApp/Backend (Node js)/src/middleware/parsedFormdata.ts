import { number } from "joi";

export const parseFormData = (data: any) => {
  let parsedData: any = {};

  for (const key in data) {
    let value = data[key];
    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {  
      value = Number(value);
    }

    parsedData[key] = value;
  }

  return parsedData;
};
