import LandingPageSection from "../../components/landingPage/LandingPageSection";
import SectionLabel from "../../components/landingPage/SectionLabel";
import Card from "../../components/common/Card";
import ContactForm from "../../components/landingPage/ContactForm";
import Title from "../../components/common/Title";
import Subtitle from "../../components/common/Subtitle";
import { Mail, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <LandingPageSection id="contact">
      <SectionLabel title="Contact Us" />
      <Title classNames="text-center text-4xl text-gray-200 sm:text-5xl">
        Get in Touch with Us
      </Title>
      <Subtitle classNames="mb-12 mt-4 text-left text-gray-400">
        We’d love to hear from you — reach out with questions, feedback, or
        collaboration ideas.
      </Subtitle>
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex w-full max-w-[540px] flex-col gap-4 md:flex-row md:justify-between">
          <Card className="flex-1">
            <div className="mb-3 flex w-full items-center gap-3">
              <Mail />
              <span>E-mail</span>
            </div>
            <p>tester@gmail.com</p>
          </Card>
          <Card className="flex-1">
            <div className="mb-3 flex w-full items-center gap-3">
              <Phone />
              <span>Phone</span>
            </div>
            <p>+1(123) 456-7890</p>
          </Card>
        </div>
        <Card className="w-full max-w-[540px]">
          <ContactForm />
        </Card>
      </div>
    </LandingPageSection>
  );
};
export default ContactSection;
