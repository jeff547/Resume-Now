import { useEffect, useState } from "react";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await Api;
        setToken(response.data.accessToken);
      } catch {
        setToken(null);
      }
    };
  });
};
export default AuthProvider;
