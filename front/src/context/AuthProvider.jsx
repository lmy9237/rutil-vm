import { useState, createContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const KEY_AUTH = "auth"
  const KEY_IS_USER_AUTHENTICATED = "isUserAuthenticated"
  const KEY_IS_USERNAME = "username"
  const initialState = JSON.parse(sessionStorage.getItem(KEY_AUTH)) ?? {
    [KEY_IS_USER_AUTHENTICATED]: false,
    [KEY_IS_USERNAME]: ""
  }
  const [sAuth, sSetAuth] = useState(initialState)
  const auth = Object.assign({}, sAuth, JSON.parse(sessionStorage.getItem(KEY_AUTH)))
  const setAuth = (newV) => {
    sSetAuth({
      ...newV
    });
    sessionStorage.setItem(KEY_AUTH, JSON.stringify(newV, null, 2));
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;