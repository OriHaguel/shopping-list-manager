import { getItem } from "@/utils/localStorage";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isGuest() {
  if (getItem('userId', '')) {
    return true;
  } else {
    return false;
  }
}