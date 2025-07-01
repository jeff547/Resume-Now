import LandingPageSection from "../../components/LandingPageSection";
import SectionLabel from "../../components/SectionLabel";
import Card from "../../components/Card";
import Button from "../../components/Button";
import ContactForm from "../../components/ContactForm";
import { Mail, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <LandingPageSection id="contact">
      <SectionLabel title="Contact Us" />
      <h3 className="text-left text-5xl text-gray-200">Get in Touch with Us</h3>
      <h1 className="mt-4 mb-14 text-left text-gray-400">
        We’d love to hear from you — reach out with questions, feedback, or
        collaboration ideas.
      </h1>
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
