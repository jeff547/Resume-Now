import LandingPageSection from "../../components/landingPage/LandingPageSection";
import SectionLabel from "../../components/landingPage/SectionLabel";
import Title from "../../components/common/Title";
import StepsCard from "../../components/landingPage/StepsCard";

const ProcessSection = () => {
  return (
    <LandingPageSection id="process">
      <SectionLabel title="Our Process" />
      <Title classNames="text-4xl text-center mb-14">
        From Blank Page to Dream Job <br /> In 3 Simple Steps
      </Title>
      <StepsCard></StepsCard>
    </LandingPageSection>
  );
};
export default ProcessSection;
