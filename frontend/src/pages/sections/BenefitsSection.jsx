import LandingPageSection from "../../components/LandingPageSection";
import SectionLabel from "../../components/SectionLabel";
import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";
import Card from "../../components/Card";

const BenefitsSection = () => {
  return (
    <LandingPageSection id="benefits">
      <SectionLabel title="Benefits" />
      <Title classNames="text-4xl text-gray-300 mb-2">
        How ResumeNow Helps You!
      </Title>
      <Subtitle classNames="text-gray-400 mb-12 text-center">
        It’s more than just resume building. <br />
        We provide clarity, confidence, and control.
      </Subtitle>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="m-3 flex flex-col items-center gap-2 text-center">
            <img
              src="src/assets/images/time.png"
              className="ml-4 h-auto w-20"
            />
            <Title classNames="font-semibold text-lg text-gray-200">
              Save Time
            </Title>
            <Subtitle classNames="text-sm ">
              You’ve got better things to do, like prepping for interviews,
              <br /> not fighting with formatting
            </Subtitle>
          </div>
        </Card>
        <Card>
          <div className="m-3 flex flex-col items-center gap-2 text-center">
            <img src="src/assets/images/search.png" className="h-auto w-20" />
            <Title classNames="font-semibold text-lg text-gray-200">
              Get Noticed
            </Title>
            <Subtitle classNames="text-sm ">
              Our AI drops the right keywords so your resume doesn’t get <br />
              ghosted by applicant tracking systems.
            </Subtitle>
          </div>
        </Card>
        <Card>
          <div className="m-3 flex flex-col items-center gap-2 text-center">
            <img src="src/assets/images/stress.png" className="w-21 h-auto" />
            <Title classNames="font-semibold text-lg text-gray-200">
              No More Resume Rage
            </Title>
            <Subtitle classNames="text-sm ">
              No more guessing what to write or how to format, <br /> we'll
              handle it for you.
            </Subtitle>
          </div>
        </Card>
        <Card>
          <div className="m-3 flex flex-col items-center gap-2 text-center">
            <img
              src="src/assets/images/confidence.png"
              className="h-auto w-20"
            />
            <Title classNames="font-semibold text-lg text-gray-200">
              Put Your Best Self Forward
            </Title>
            <Subtitle classNames="text-sm ">
              We help you tell your story with clarity, strength, <br />
              and professionalism.
            </Subtitle>
          </div>
        </Card>
        <Card>
          <div className="m-3 flex flex-col items-center gap-2 text-center">
            <img src="src/assets/images/target.png" className="h-auto w-20" />
            <Title classNames="font-semibold text-lg text-gray-200">
              Optimize for Results
            </Title>
            <Subtitle classNames="text-sm ">
              Match your resume to the job, and improve your <br />
              chances of getting hired.
            </Subtitle>
          </div>
        </Card>
        <Card>
          <div className="m-3 flex flex-col items-center gap-2 text-center">
            <img src="src/assets/images/support.png" className="h-auto w-20" />
            <Title classNames="font-semibold text-lg text-gray-200">
              Smart Suggestions as You Go
            </Title>
            <Subtitle classNames="text-sm ">
              Our system offers real-time improvements to
              <br /> strengthen your writing and tone.
            </Subtitle>
          </div>
        </Card>
      </div>
      <Title></Title>
    </LandingPageSection>
  );
};
export default BenefitsSection;
