const Button = ({ text, size = "md", handleClick }) => {
  const sizeClasses = {
    sm: "px-4.5 py-2.5 text-sm font-base ",
    md: "px-5.5 py-3.5 text-base font-medium",
  };

  return (
    <button
      type={handleClick === "submitForm" ? "submit" : undefined}
      className={`${sizeClasses[size]} cursor-pointer rounded-xl border border-purple-400 bg-gradient-to-b from-[#551dd9] to-[#7d58cd] transition duration-700 hover:border-purple-300 hover:from-[#6322f9] hover:to-[#9b6dfd] hover:text-gray-200`}
    >
      {text}
    </button>
  );
};

export default Button;
