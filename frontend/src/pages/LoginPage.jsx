import particlesConfig from "../assets/configs/particlesjs-config.json";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useState, useEffect } from "react";
import { loadSlim } from "@tsparticles/slim";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";

import googleLogo from "/frontend/src/assets/images/google.png";
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
      <div className="flex min-h-screen items-center justify-end mx-12">
        <Card>
          <div className="flex flex-col items-center mb-8">
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
              <section>
                <Seperator />
                <button
                  className="text-gray-500 flex items-center gap-3 bg-white mx-4 my-8 border border-gray-600 py-3 pl-6 pr-16 rounded-xl hover:bg-gray-100"
                  onClick={() => googleLogin()}
                >
                  <img src={googleLogo} alt="google" className="w-6 h-6" />
                  Sign In with Google
                </button>
                <p className="text-gray-400 cursor-default">
                  {register
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <span
                    className="pl-2 underline underline-offset-2 cursor-pointer hover:text-gray-200 hover:font-semibold"
                    onClick={() => setRegister(!register)}
                  >
                    {register ? "Sign in" : "Register Now"}
                  </span>
                </p>
              </section>
            )}
          </div>
        </Card>

        <DotLottieReact
          src="src/assets/animations/hello.lottie"
          loop
          autoplay
          className="md:h-[400px] md:w-[700px]"
        />
      </div>
    </>
  );
};
export default LoginPage;
