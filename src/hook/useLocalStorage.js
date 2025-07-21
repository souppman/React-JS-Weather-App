import { useState, useEffect } from 'react';

// localStorage hook with react state
export default function useLocalStorage(key, defaultVal) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
      return defaultVal;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultVal;
    }
  });

  // save to localStorage whenever value changes
  useEffect(() => {
    if (value === undefined) return;
    try {
        //json stringify to store the value as a string
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [value, key]);

  return [value, setValue];
}


