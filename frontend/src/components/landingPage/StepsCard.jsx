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
      className="flex flex-col items-center gap-6 lg:flex-row"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="relative w-full max-w-xl overflow-hidden">
        <DotLottieReact
          src="/animations/scan.lottie"
          className="h-auto w-full lg:w-[800px] lg:translate-x-[-100px]"
          autoplay
          loop
        />
      </div>
      <div className="flex w-full max-w-xl flex-col items-center justify-center text-center lg:items-start lg:text-left">
        <Subtitle classNames="text-gray-600 mb-3">0{page + 1}</Subtitle>
        <Title classNames="text-lg mb-2">Start With You</Title>
        <Subtitle classNames="text-gray-400 text-sm leading-relaxed">
          Upload your resume, paste your LinkedIn, or answer a few quick
          questions — we’ll turn your background into a professional foundation.
        </Subtitle>
      </div>
    </motion.div>,
    <motion.div
      key="2"
      className="flex flex-col items-center gap-6 lg:flex-row"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="relative w-full max-w-xl overflow-hidden">
        <DotLottieReact
          src="/animations/work.lottie"
          className="h-auto w-full lg:w-[800px] lg:translate-x-[-100px]"
          autoplay
          loop
        />
      </div>
      <div className="flex w-full max-w-xl flex-col items-center justify-center text-center lg:items-start lg:text-left">
        <Subtitle classNames="text-gray-600 mb-3">0{page + 1}</Subtitle>
        <Title classNames="text-lg mb-2">Let AI Build It</Title>
        <Subtitle classNames="text-gray-400 text-sm leading-relaxed">
          Our GPT-4-powered engine highlights your strengths, rewrites what
          needs work, and delivers a polished, recruiter-ready draft — instantly.
        </Subtitle>
      </div>
    </motion.div>,
    <motion.div
      key="3"
      className="flex flex-col items-center gap-6 lg:flex-row"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <div className="relative w-full max-w-xl overflow-hidden">
        <DotLottieReact
          src="/animations/complete.lottie"
          className="h-auto w-full lg:w-[800px] lg:translate-x-[-100px]"
          autoplay
          loop
        />
      </div>
      <div className="flex w-full max-w-xl flex-col items-center justify-center text-center lg:items-start lg:text-left">
        <Subtitle classNames="text-gray-600 mb-3">0{page + 1}</Subtitle>
        <Title classNames="text-lg mb-2">Tweak & Download</Title>
        <Subtitle classNames="text-gray-400 text-sm leading-relaxed">
          Review your resume, make any final edits, then download it in PDF,
          Word, or latex — no formatting headaches or font battles required.
        </Subtitle>
      </div>
    </motion.div>,
  ];

  return (
    <Card>
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`${page === i ? "border-[#3a3a3a] bg-[#161616] text-gray-300" : "border-[#212121] bg-[#0a0a0a] text-gray-500"} duration-1500 rounded-lg border px-6 py-2.5 text-sm font-medium transition hover:border-[#3a3a3a] hover:bg-[#161616] hover:text-gray-300 sm:px-10 lg:px-32`}
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
