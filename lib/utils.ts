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

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export function sortedIds(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort();
  return sortedIds[0] + "--" + sortedIds[1];
}
