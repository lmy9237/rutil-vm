// GlobalContext.js
import React, { createContext, useState } from 'react';
import Logger from '../utils/Logger';

const GlobalContext = createContext();

/**
 * @name GlobalProvider
 * @description 전역변수 보관 및 제공
 * 
 * @param {*} param0 
 * 
 * @returns {React.Provider}
 */
export const GlobalProvider = ({ children }) => {
  const [store, setStore] = useState({});
  const setValue = (key, value) => {
    Logger.debug(`GlobalProvider > setValue ... ${key}: ${value}`)
    setStore(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value);
  }
  const getValue = key => store[key] ?? localStorage.getItem(key);  

  return (
    <GlobalContext.Provider value={{ store, setValue, getValue }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;