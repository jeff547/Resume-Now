import logo from "../assets/images/logo.png";
import Search from "./Search";
import CreateButton from "./CreateButton";
import { useNavigate } from "react-router-dom";

const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-1100 flex items-center justify-between px-8 py-4">
      <h1
        className="hidden cursor-pointer items-center gap-2 font-normal text-gray-100 md:flex"
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
