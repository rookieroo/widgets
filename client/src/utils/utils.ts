import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const computeColor = (color: string) => {
  if (color.length !== 6) {
    color = `${color}${color}`
  }
  // rgb values
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)

  return { r, g, b }
}

// Determine the accessible color of text
export function getAccessibleColor(hex: string) {
  const color = hex.replace(/#/g, '')
  const { r, g, b } = computeColor(color)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#000000' : '#FFFFFF'
}

// Change hex color into RGB
export const getRGBColor = (hex: string, type: string) => {
  const color = hex.replace(/#/g, '')
  const { r, g, b } = computeColor(color)
  return `--color-${type}: ${r}, ${g}, ${b};`
}

export const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export const triplet = (e1, e2, e3) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r, g, b) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

export function generateKey(length = 16) {
  return Math.random().toString(36).substr(2, length);
}

