import { api } from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const REFRESH_TOKEN_URL = "/token/refresh";
  const { setToken } = useAuth();

  const refresh = async () => {
    const response = await api.get(REFRESH_TOKEN_URL, {
      withCredentials: true,
    });

    // Update token in app state
    setToken(response.data.access_token);

    return response.data.access_token;
  };

  return refresh;
};

export default useRefreshToken;
