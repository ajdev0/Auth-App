import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("NEST_RETOKEN") || ""
  );
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const login = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signin`,
        data
      );
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("NEST_TOKEN", accessToken);
      localStorage.setItem("NEST_RETOKEN", refreshToken);
      setToken(refreshToken);
      navigate("/welcome");
      //console.log(data);
    } catch (error) {
      const { data } = error.response;
      setError(data.message);
    }
  };

  //logout

  return (
    <AuthContext.Provider value={{ token, login, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
