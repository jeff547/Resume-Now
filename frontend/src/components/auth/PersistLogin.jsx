import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

const PersistLogin = () => {
  const { token } = useAuth();
  const [persist] = useLocalStorage("persist", false);
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !token ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`Access Token: ${token}`);
  }, [isLoading]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
