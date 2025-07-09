import particlesConfig from "../assets/configs/particlesjs-config.json";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useState, useEffect } from "react";
import { loadSlim } from "@tsparticles/slim";
import LoginForm from "../components/LoginForm";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoginPage = () => {
  // Initialize particles effect form tsparticles
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
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
      <div className="flex min-h-screen items-center justify-end">
        <div className="ml-16">{<LoginForm />}</div>
        <DotLottieReact
          src="src/assets/animations/hello.lottie"
          loop
          autoplay
          className="h-auto w-[800px]"
        />
      </div>
    </>
  );
};
export default LoginPage;
