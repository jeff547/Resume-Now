const CTA = ({ text, size = "md" }) => {
  const sizeClasses = {
    sm: "px-4.5 py-2.5 text-sm font-base",
    md: "px-5.5 py-3.5 text-base font-medium border border-purple-400 hover:border-purple-300",
  };

  return (
    <button
      className={`${sizeClasses[size]} cursor-pointer rounded-xl bg-gradient-to-b from-[#551dd9] to-[#7d58cd] transition duration-700 hover:from-[#6322f9] hover:to-[#9b6dfd] hover:text-gray-200`}
    >
      {text}
    </button>
  );
};

export default CTA;
