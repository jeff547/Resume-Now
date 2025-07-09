const Card = ({ children }) => {
  return (
    <div className="border-1 z-10 rounded-lg border-gray-800 bg-gradient-to-br from-black via-[#141414] via-65% to-[#311251] p-4">
      {children}
    </div>
  );
};
export default Card;
