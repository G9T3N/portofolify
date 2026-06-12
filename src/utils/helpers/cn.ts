import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class-name values and resolve Tailwind utility conflicts into a single class string.
 *
 * Normalizes the provided class values (strings, arrays, objects, etc.) and produces a merged class list with Tailwind duplicate/conflicting utilities resolved.
 *
 * @param inputs - Class name values to merge (strings, arrays, objects, boolean conditions, etc.)
 * @returns The final merged class string with Tailwind utility conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
