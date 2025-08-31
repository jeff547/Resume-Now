import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Store Access Token in state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
