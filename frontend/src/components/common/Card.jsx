const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`border-1 z-5 rounded-lg border-gray-800 bg-gradient-to-br from-black via-[#141414] via-65% to-[#311251] p-4 ${className}`}
    >
      {children}
    </div>
  );
};
export default Card;
