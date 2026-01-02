import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatVariant(color?: string, size?: string) {
  const variantItem = [color, size].filter(String)
  return variantItem.join(' - ')
}
