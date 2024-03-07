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
