import { apiAuth } from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";

const useApiAuth = () => {
  const refresh = useRefreshToken();
  const { token } = useAuth();

  useEffect(() => {
    const requestIntercept = apiAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = apiAuth.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        // logging
        console.log(`Prev Request: ${prevRequest}`);

        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiAuth(prevRequest);
        }

        return Promise.reject(err);
      }
    );

    return () => {
      apiAuth.interceptors.response.eject(responseIntercept);
      apiAuth.interceptors.request.eject(requestIntercept);
    };
  }, [token, refresh]);
  return apiAuth;
};

export default useApiAuth;
