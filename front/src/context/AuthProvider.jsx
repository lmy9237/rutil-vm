import { useState, createContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [sAuth, sSetAuth] = useState({})
  const auth = Object.assign({}, sAuth, JSON.parse(localStorage.getItem("auth")))
  const setAuth = (newV) => {
    sSetAuth(newV);
    localStorage.setItem("auth", JSON.stringify(newV, null, 2));
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;