import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import Title from "./Title";

const LoginForm = () => {
  // display login form vs sign up form
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
  };

  return (
    <Card>
      <form
        className="flex min-w-[400px] flex-col items-start gap-6 px-8 py-6"
        onSubmit={handleSubmit}
      >
        <Title classNames="text-xl font-semibold mb-1">Sign Up</Title>
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
        <button
          type="submit"
          className="px-4.5 mt-4 w-full cursor-pointer rounded-xl border border-purple-400 bg-gradient-to-b from-[#551dd9] to-[#7d58cd] py-3 transition duration-700 hover:border-purple-300 hover:from-[#6322f9] hover:to-[#9b6dfd] hover:text-gray-200"
        >
          {login ? "Login" : "Sign Up"}
        </button>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            setLogin(true);
            navigate("/dashboard", { replace: true });
          }}
          onError={() => console.log("GoogleOAuth Failed")}
          size="large"
          width="335"
        />
      </form>
    </Card>
  );
};
export default LoginForm;
