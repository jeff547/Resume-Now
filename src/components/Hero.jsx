import Button from "./Button";
import LandingPageSection from "./LandingPageSection";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Hero = () => {
  return (
    <LandingPageSection id="home">
      <h1 className="mb-4 cursor-default bg-gradient-to-br from-gray-500 to-gray-300 bg-clip-text text-center text-6xl font-medium text-transparent">
        Land Your Dream Job <br />
        With an AI-Crafted Resume
      </h1>
      <h2 className="mb-8 cursor-default bg-gradient-to-br from-gray-600 to-gray-400 bg-clip-text text-center text-base font-light text-transparent">
        Turn your experience into a professionally written resume — powered by
        GPT-4. <br />
        Free to start, optimized to impress.
      </h2>

      <Button text="Create My Resume" />
      <DotLottieReact
        src="src/assets/animations/process.lottie"
        autoplay
        loop
        className="mt-20 h-auto w-1/2"
      />
    </LandingPageSection>
  );
};

export default Hero;
