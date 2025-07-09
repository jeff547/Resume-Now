import LandingPageSection from "../../components/LandingPageSection";
import SectionLabel from "../../components/SectionLabel";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";

const AboutUsSection = () => {
  return (
    <LandingPageSection id="about">
      <SectionLabel title="About Us" />
      <Title classNames="mb-5 text-center text-6xl">Mission & Purpose</Title>
      <Subtitle classNames="text-center text-gray-400">
        We started ResumeNow because writing a resume shouldn’t feel like a
        full-time job. Whether you’re applying <br />
        to your first internship or making a career change, everyone deserves a
        resume that <br />
        reflects who they are — not how good they are at formatting.
      </Subtitle>
      <DotLottieReact
        src="src/assets/animations/innovation.lottie"
        loop
        autoplay
        className="mt-10 h-auto w-2/5"
      />
    </LandingPageSection>
  );
};
export default AboutUsSection;
