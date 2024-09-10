import { v4 as uuidv4 } from "uuid";
import { defineAdSlot } from "../components/AdSlot/lib-dfp-index";

export const getUID = () => {
  return localStorage.getItem("uid");
};

export const setUID = () => {
  return localStorage.setItem("uid", uuidv4());
};

export const defineCustomSlots = (params) => {
  if(params){
    const { path, id, dimension } = params;
    let size = dimension.replace(/'/g, '"');
    size = size.slice(1, -1);
    size = size?.split(", ");
    size = size.map(Number);
    defineAdSlot(path, id, size);
  }
};
