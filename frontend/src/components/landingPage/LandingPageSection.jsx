import { motion } from "framer-motion";

const LandingPageSection = ({ id, children }) => {
  return (
    <motion.section
      initial={id === "home" ? { opacity: 0 } : { opacity: 0, y: 75 }}
      whileInView={id === "home" ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, delay: 0.6 }}
      id={id}
      className={`${id === "home" ? "min-h-screen" : "min-h-[60vh]"} font-roboto mb-30 mt-10 flex w-full flex-col items-center px-4 sm:px-8 lg:px-16`}
    >
      {children}
    </motion.section>
  );
};
export default LandingPageSection;
