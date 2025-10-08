import Card from "../common/Card";
import { useState } from "react";
import { motion } from "framer-motion";
import Subtitle from "../common/Subtitle";
import Title from "../common/Title";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const StepsCard = () => {
  const [page, setPage] = useState(0);

  const pages = [
    <motion.div
      key="1"
      className="flex"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="relative w-[550px] overflow-hidden">
        <DotLottieReact
          src="public/animations/scan.lottie"
          className="h-auto w-[800px] translate-x-[-100px]"
          autoplay
          loop
        />
      </div>
      <div className="flex flex-col items-start justify-center">
        <Subtitle classNames="text-gray-600 mb-3">0{page + 1}</Subtitle>
        <Title classNames="text-lg mb-2">Start With You</Title>
        <Subtitle classNames="text-gray-400 text-sm">
          Upload your resume, paste your LinkedIn, or <br />
          answer a few quick questions — we’ll turn <br />
          your background into a professional foundation.
        </Subtitle>
      </div>
    </motion.div>,
    <motion.div
      key="2"
      className="flex"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="relative w-[550px] overflow-hidden">
        <DotLottieReact
          src="public/animations/work.lottie"
          className="h-auto w-[800px] translate-x-[-100px]"
          autoplay
          loop
        />
      </div>
      <div className="flex flex-col items-start justify-center">
        <Subtitle classNames="text-gray-600 mb-3">0{page + 1}</Subtitle>
        <Title classNames="text-lg mb-2">Let AI Build It</Title>
        <Subtitle classNames="text-gray-400 text-sm">
          Our GPT-4-powered engine highlights your <br />
          strengths, rewrites what needs work, and delivers <br />a polished,
          recruiter-ready draft — instantly.
        </Subtitle>
      </div>
    </motion.div>,
    <motion.div
      key="3"
      className="flex"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="relative w-[550px] overflow-hidden">
        <DotLottieReact
          src="public/animations/complete.lottie"
          className="h-auto w-[800px] translate-x-[-100px]"
          autoplay
          loop
        />
      </div>
      <div className="flex flex-col items-start justify-center">
        <Subtitle classNames="text-gray-600 mb-3">0{page + 1}</Subtitle>
        <Title classNames="text-lg mb-2">Tweak & Download</Title>
        <Subtitle classNames="text-gray-400 text-sm">
          Review your resume, make any final edits, then <br />
          download it in PDF, Word, or latex — no formatting <br />
          headaches or font battles required.
        </Subtitle>
      </div>
    </motion.div>,
  ];

  return (
    <Card>
      <div className="flex gap-4 px-4">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`${page === i ? "border-[#3a3a3a] bg-[#161616] text-gray-300" : "border-[#212121] bg-[#0a0a0a] text-gray-500"}duration-1500 rounded-lg border px-32 py-2.5 transition hover:border-[#3a3a3a] hover:bg-[#161616] hover:text-gray-300`}
          >
            Step {i + 1}
          </button>
        ))}
      </div>
      <div>{pages[page]}</div>
    </Card>
  );
};
export default StepsCard;
