import CTA from "./CTA";

const Hero = () => {
  return (
    <div className="mt-32 flex min-h-screen flex-col items-center gap-4.5">
      <h1 className="cursor-default bg-gradient-to-br from-gray-500 to-gray-300 bg-clip-text text-center text-6xl font-medium text-transparent">
        Land Your Dream Job <br />
        With an AI-Crafted Resume
      </h1>
      <h2 className="font-roboto mb-3 cursor-default bg-gradient-to-br from-gray-600 to-gray-400 bg-clip-text text-center text-base font-light text-transparent">
        Turn your experience into a professionally written resume — powered by
        GPT-4. <br />
        Free to start, optimized to impress.
      </h2>
      <CTA text="Create My Resume" />
    </div>
  );
};

export default Hero;
