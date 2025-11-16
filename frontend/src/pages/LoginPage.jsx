import particlesConfig from "../assets/configs/particlesjs-config.json";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useState, useEffect } from "react";
import { loadSlim } from "@tsparticles/slim";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";

import googleLogo from "../assets/images/google.png";
import Seperator from "../components/common/Seperator";
import Card from "../components/common/Card";
import Register from "../components/auth/RegisterForm";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  // Initalize Google Oauth login
  const googleLogin = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
      navigate(from, { replace: true });
    },
    onError: () => console.log("GoogleOAuth Failed"),
  });
  // Registration Success
  const [success, setSuccess] = useState(false);
  // Initialize particles effect form tsparticles
  const [init, setInit] = useState(false);
  // Display login form vs sign up form
  const [register, setRegister] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // Load particles engine
    }).then(() => {
      setInit(true);
    });
  });
  const particlesLoaded = () => {
    console.log("particles loaded");
  };

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particlesConfig}
          className="pointer-events-none absolute"
        />
      )}
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-8 px-3 py-10 sm:px-4 lg:flex-row lg:items-center lg:justify-center lg:gap-14 lg:px-8">
        <Card className="w-full max-w-xl">
          <div className="mb-8 flex w-full flex-col items-center">
            {register ? (
              <Register
                success={success}
                setSuccess={setSuccess}
                setRegister={setRegister}
              />
            ) : (
              <LoginForm from={from} />
            )}
            {success || (
              <section className="flex w-full flex-col items-center text-center">
                <Seperator />
                <button
                  className="mx-auto my-8 flex w-auto max-w-[220px] items-center justify-center gap-3 rounded-xl border border-gray-600 bg-white px-4 py-3 text-gray-500 hover:bg-gray-100 sm:max-w-none sm:px-6 sm:py-3"
                  onClick={() => googleLogin()}
                >
                  <img src={googleLogo} alt="google" className="h-6 w-6" />
                  Sign In with Google
                </button>
                <p className="cursor-default text-gray-400">
                  {register
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <span
                    className="cursor-pointer pl-2 underline underline-offset-2 hover:font-semibold hover:text-gray-200"
                    onClick={() => setRegister(!register)}
                  >
                    {register ? "Sign in" : "Register Now"}
                  </span>
                </p>
              </section>
            )}
          </div>
        </Card>

        <div className="flex w-full justify-center">
          <DotLottieReact
            src="/animations/hello.lottie"
            loop
            autoplay
            className="w-full max-w-md object-contain md:max-w-lg"
            style={{ aspectRatio: "3 / 2" }}
          />
        </div>
      </div>
    </>
  );
};
export default LoginPage;
