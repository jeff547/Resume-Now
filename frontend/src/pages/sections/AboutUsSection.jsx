import LandingPageSection from "../../components/landingPage/LandingPageSection";
import SectionLabel from "../../components/landingPage/SectionLabel";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Title from "../../components/common/Title";
import Subtitle from "../../components/common/Subtitle";

const AboutUsSection = () => {
  return (
    <LandingPageSection id="about">
      <SectionLabel title="About Us" />
      <Title classNames="mb-5 px-4 text-center text-4xl text-gray-200 sm:text-5xl lg:text-6xl">
        Mission & Purpose
      </Title>
      <Subtitle classNames="max-w-4xl px-4 text-center text-base text-gray-400 sm:text-lg">
        We started ResumeNow because writing a resume shouldn’t feel like a
        full-time job.
        <br className="hidden md:block" />
        Whether you’re applying to your first internship or making a career
        change, everyone deserves a resume that reflects who they are — not how
        good they are at formatting.
      </Subtitle>
      <DotLottieReact
        src="/animations/innovation.lottie"
        loop
        autoplay
        className="mt-10 h-auto w-full max-w-3xl"
      />
    </LandingPageSection>
  );
};
export default AboutUsSection;
