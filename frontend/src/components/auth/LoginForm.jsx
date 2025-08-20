import { useEffect, useRef, useState } from "react";
import Title from "../common/Title";

const LoginForm = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Focus on first input box when first opening page
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Updates error message depending on user input
  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.target);
  // };

  return (
    <form
      className="flex w-[420px] flex-col items-start gap-6 px-8 pt-6"
      // onSubmit={handleSubmit}
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
          name="email"
          placeholder="JohnDoe@mail.com"
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
          name="password"
          placeholder="••••••••••"
          required
          className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
        />
      </div>
      <button type="submit" className="mt-4 py-3 w-full button">
        Login
      </button>
    </form>
  );
};
export default LoginForm;
