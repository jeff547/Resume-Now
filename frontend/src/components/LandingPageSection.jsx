import { motion } from "framer-motion";

const LandingPageSection = ({ id, children }) => {
  return (
    <motion.section
      initial={id === "home" ? { opacity: 0 } : { opacity: 0, y: 75 }}
      whileInView={id === "home" ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.6 }}
      id={id}
      className={`${id === "home" ? "h-[90vh]" : "h-[80vh]"} font-roboto my-24 flex flex-col items-center`}
    >
      {children}
    </motion.section>
  );
};
export default LandingPageSection;
