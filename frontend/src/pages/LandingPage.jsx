import Header from "../components/landingPage/Header";
import Hero from "../components/landingPage/Hero";
import AboutUsSection from "./sections/AboutUsSection";
import BenefitsSection from "./sections/BenefitsSection";
import ContactSection from "./sections/ContactSection";
import ProcessSection from "./sections/ProcessSection";
import particlesConfig from "../assets/configs/particlesjs-config.json";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useState, useEffect } from "react";
import { loadSlim } from "@tsparticles/slim";

const LandingPage = () => {
  // Initialize particles effect form tsparticles
  const [init, setInit] = useState(false);

  useEffect(() => {
    console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
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
    <div className="relative min-h-screen w-full">
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particlesConfig}
          className="pointer-events-none absolute"
        />
      )}
      <Header />
      <Hero />
      <BenefitsSection />
      <ProcessSection />
      <AboutUsSection />
      <ContactSection />
    </div>
  );
};
export default LandingPage;
