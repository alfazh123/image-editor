"use client";

export function getWindowSize() {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth - 200,
      height: window.innerHeight
    };
  }
  return { width: 800, height: 600 };
}
