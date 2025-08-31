import logo from "/frontend/src/assets/images/logo.png";
import Search from "./Search";
import CreateButton from "./CreateButton";
import { useNavigate } from "react-router-dom";

const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center bg-gray-1100 py-4 px-8 justify-between">
      <h1
        className="hidden md:flex cursor-pointer items-center gap-2 text-gray-100 font-normal"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="logo" className="w-5" />
        ResumeNow
      </h1>
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CreateButton />
    </div>
  );
};

export default Header;
