import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPostcode(postcode: string): string {
  return postcode.toUpperCase().replace(/\s+/g, '')
}

export function calculateDistance(postcode1: string, postcode2: string): number {
  // Simplified distance calculation - in production, use a proper postcode API
  // For now, return a mock distance based on first part of postcode
  const area1 = postcode1.substring(0, 2)
  const area2 = postcode2.substring(0, 2)
  return area1 === area2 ? 5 : 15
}

export function formatCategory(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}
