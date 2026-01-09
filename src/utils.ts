import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses an FFLogs URL to extract report code and fight ID
 * @param url The FFLogs URL to parse
 * @returns An object containing reportCode and fightId, or null if invalid
 */
export function parseFFLogsUrl(url: string): { reportCode: string; fightId: string } | null {
  try {
    // Clean up the URL by removing leading/trailing whitespace
    const cleanUrl = url.trim();

    // Check if it's a valid FFLogs URL
    const fflogsRegex = /.*fflogs\.com\/reports\/([a-zA-Z0-9]+)(?:\?.*fight=([^&\s]+))?/;
    const match = cleanUrl.match(fflogsRegex);

    if (!match) {
      return null;
    }

    const reportCode = match[1];
    const fightId = match[2] || '';

    return { reportCode, fightId };
  } catch (error) {
    console.error('Error parsing FFLogs URL:', error);
    return null;
  }
}
