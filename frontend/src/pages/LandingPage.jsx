import Header from "../components/Header";
import Hero from "../components/Hero";
import AboutUsSection from "./sections/AboutUsSection";
import BenefitsSection from "./sections/BenefitsSection";
import ContactSection from "./sections/ContactSection";
import ProcessSection from "./sections/ProcessSection";
import particlesConfig from "../assets/configs/particlesjs-config.json";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect } from "react";

const LandingPage = () => {
  // Initialize particles effect form tsparticles
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  });
  const particlesLoaded = (container) => {
    console.log(container);
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
