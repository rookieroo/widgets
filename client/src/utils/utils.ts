import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const DEFAULT_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7klEQVR4nK3TMUvDUBQF4C/FQYiDk4uDm0MHBwf/g5ObOLg5OLj0JygOzg4OrjoIOjg4iIiDiINQHEREHEREpINIhw5FRIQiInJlaPMSawoNHjjDu/ede+4N/BeZwGOmP1Fq4Q3PMQ7XOAx7VfSwiY84HuIuxlXsoRPjJrawhw6WMI8FzKGNmxh3sIGpIQEbaOIlalVsI49+Fi38RK2JmyEBC1jFcYxnuM2E3eP8j/oNDh/Ru8RVnB+wHf0qPrA2SkALrzG/H7hFKXJ1rIwScIaneGAeZQwGapOjBJTxiXOURwmoYTnuVf6qvYsP9AdNnGX+3TqZTwAAAABJRU5ErkJggg==';

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

export const debounce = (callback, delay) => {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
};

function parseBookmarks(node) {
  const items = [];
  for (const child of node.children) {
    if (child.tagName === 'DT') {
      const dt = child;
      if (dt.firstElementChild.tagName === 'H3') {
        const folderName = dt.firstElementChild.textContent;
        const dlNode = dt.querySelector('dl');
        const children = dlNode ? parseBookmarks(dlNode) : [];
        if (children.length > 0) {
          items.push({
            name: folderName,
            type: 'folder',
            children: children
          });
        }
      } else if (dt.firstElementChild.tagName === 'A') {
        const a = dt.firstElementChild;
        items.push({
          name: a.textContent,
          url: a.href,
          type: 'bookmark',
          addDate: a.getAttribute('add_date'),
          icon: a.getAttribute('icon') || DEFAULT_ICON
        });
      }
    }
  }
  return items;
}

export function convertBookmarks(dom) {
  // const fileInput = document.getElementById('fileInput');
  const fileInput = dom;
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const htmlContent = e.target.result;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const bookmarkList = doc.querySelector('dl');
    if (!bookmarkList) {
      alert('No bookmarks found in the file');
      return;
    }

    const bookmarks = parseBookmarks(bookmarkList);
    const jsonOutput = JSON.stringify(bookmarks, null, 2);

    return jsonOutput
    // document.getElementById('output').textContent = jsonOutput;

    // Download JSON file
    // const blob = new Blob([jsonOutput], {type: 'application/json'});
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'bookmarks.json';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };
  reader.readAsText(file);
}

