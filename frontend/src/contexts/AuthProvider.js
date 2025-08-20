import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (newToken) => {
    const decoded = jwtDecode(newToken);
    setToken(newToken);
    print(decoded); // debug
    setUser(decoded.user || decoded);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };
  return (
    <authContext.Provider value={{ user, token, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
