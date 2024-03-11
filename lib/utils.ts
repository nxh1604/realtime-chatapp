import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pause(milliseconds: number) {
  var dt = new Date();
  while (new Date().getTime() - dt.getTime() <= milliseconds) {
    /* Do nothing */
  }
}

export function sortedIds(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return sortedIds[0] + "--" + sortedIds[1];
}

export function dateFormatForMessage(timeStamp: number | string) {
  const date = new Date(timeStamp);
  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
  const mininutes = date.getMinutes();
  const AmOrPm = date.getHours() > 11 ? "PM" : "AM";
  console.log(`${hours} : ${mininutes} ${AmOrPm}`);

  return `${hours} : ${mininutes} ${AmOrPm}`;
}
