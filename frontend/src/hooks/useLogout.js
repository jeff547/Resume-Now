import { api } from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setToken } = useAuth();

  const logout = async () => {
    setToken(null);
    try {
      await api.delete("/logout", {
        withCredentials: true,
      });
      localStorage.clear();
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
