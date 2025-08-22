import { api } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const REFRESH_TOKEN_URL = "/token/refresh";
  const { setToken } = useAuth();

  const refresh = async () => {
    const response = await api.get(REFRESH_TOKEN_URL, {
      withCredentials: true,
    });

    setToken((prev) => {
      console.log(`Old Access Token: ${prev}`);
      console.log(`New Access Token: ${response.data.access_token}`);
      // Update token in app state
      return response.data.access_token;
    });

    return response.data.access_token;
  };

  return refresh;
};

export default useRefreshToken;
