import LandingPageSection from "../../components/LandingPageSection";
import SectionLabel from "../../components/SectionLabel";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ContactForm from "../../components/ContactForm";
import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";
import { Mail, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <LandingPageSection id="contact">
      <SectionLabel title="Contact Us" />
      <Title classNames="text-left text-5xl text-gray-200">
        Get in Touch with Us
      </Title>
      <Subtitle classNames="mb-12 mt-4 text-left text-gray-400">
        We’d love to hear from you — reach out with questions, feedback, or
        collaboration ideas.
      </Subtitle>
      <div className="flex flex-col">
        <div className="mb-6 flex w-[540px] justify-between">
          <Card>
            <div className="mb-3 flex items-center gap-3 pr-36">
              <Mail />
              <span>E-mail</span>
            </div>
            <p>jeff547@gmail.com</p>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-3 pr-36">
              <Phone />
              <span>Phone</span>
            </div>
            <p>+1(973) 337-3983</p>
          </Card>
        </div>
        <Card>
          <ContactForm />
        </Card>
      </div>
    </LandingPageSection>
  );
};
export default ContactSection;
