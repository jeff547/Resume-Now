import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Title from "../common/Title";
import ErrorMessage from "./ErrorMessage";

import { api } from "/frontend/src/api/axios";
import useAuth from "../../hooks/useAuth";
import useInput from "../../hooks/useInput";
import useToggle from "../../hooks/useToggle";

const LoginForm = ({ from }) => {
  const LOGIN_URL = "/login/token";

  const navigate = useNavigate();
  const { setToken } = useAuth();

  const userRef = useRef();
  const errRef = useRef();

  const [email, resetEmail, emailAttribs] = useInput("email", "");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [check, toggleCheck] = useToggle("persist", false);

  // Focus on first input box when first opening page
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Updates error message depending on user input
  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Email: ${email} Password: ${pwd}`); // logging
    try {
      const response = await api.post(
        LOGIN_URL,
        new URLSearchParams({ username: email, password: pwd }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      console.log(`'${LOGIN_URL}' response: ${JSON.stringify(response?.data)}`); // logging

      // Get access token
      const accessToken = response?.data.access_token;
      // Set token to app state
      await setToken(accessToken);

      // Check HTTP success status code
      if (response.status == 200) {
        resetEmail();
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status == 401) {
        setErrMsg("Incorrect email or password.");
      } else {
        setErrMsg("Login Failed: Unknown Error");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <ErrorMessage errMsg={errMsg} errRef={errRef} />
      <form
        className="flex w-[420px] flex-col items-start gap-6 px-8 pt-6"
        onSubmit={handleSubmit}
      >
        <Title classNames="text-3xl font-semibold text-gray-200 mb-2">
          Welcome Back!
        </Title>
        <div className="w-full">
          <label htmlFor="email" className="mb-3 block text-gray-200">
            E-mail
          </label>
          <input
            type="text"
            id="email"
            ref={userRef}
            placeholder="JohnDoe@mail.com"
            {...emailAttribs}
            autoComplete="email"
            required
            className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
          />
        </div>
        <div className="w-full">
          <label htmlFor="email" className="mb-3 block text-gray-200">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••••"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
          />
        </div>
        <div className="flex gap-1.5">
          <input
            type="checkbox"
            id="persist"
            onChange={toggleCheck}
            checked={check}
            className="w-4 accent-purple-200 hover:accent-purple-400"
          />
          <label htmlFor="persist" className="text-gray-300 text-sm">
            Trust This Device
          </label>
        </div>
        <button type="submit" className="mt-4 py-3 w-full button">
          Login
        </button>
      </form>
    </>
  );
};
export default LoginForm;
