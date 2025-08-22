import { useState, useEffect } from "react";

const getLocalValue = (key, initValue) => {
  // Value is already stored
  const localValue = JSON.parse(localStorage.getItem(key));
  if (localValue) return localValue;

  // Result of function
  if (initValue instanceof Function) return initValue();

  return initValue;
};

const useLocalStorage = (key, initValue) => {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initValue);
  });

  // Updates localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
