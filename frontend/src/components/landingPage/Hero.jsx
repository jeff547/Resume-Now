import CTA from "./CTA";
import LandingPageSection from "./LandingPageSection";
import logo from "../../assets/images/logo.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Title from "../common/Title";
import Subtitle from "../common/Subtitle";

const Hero = () => {
  return (
    <LandingPageSection id="home">
      <img src={logo} className="mb-8 inline w-14" />
      <Title classNames="text-center text-6xl mb-4 bg-gradient-to-br from-gray-500 to-gray-300 bg-clip-text text-transparent">
        Land Your Dream Job <br />
        With an AI-Crafted Resume
      </Title>
      <Subtitle classNames="text-center text-6xl mb-8 bg-gradient-to-br from-gray-600 to-gray-400 bg-clip-text text-transparent">
        Turn your experience into a professionally written resume — powered by
        GPT-4. <br />
        Free to start, optimized to impress.
      </Subtitle>
      <CTA text="Create My Resume" />
      <DotLottieReact
        src="/animations/process.lottie"
        autoplay
        loop
        className="mt-16 h-auto w-2/5"
      />
    </LandingPageSection>
  );
};

export default Hero;
