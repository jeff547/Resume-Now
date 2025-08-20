import NavBar from "./NavBar";
import CTA from "./CTA";
import Logo from "../common/Logo";

const Header = () => {
  return (
    <header className="z-20 border-b-1 sticky top-0 w-auto border-gray-800 bg-black">
      <div className="mx-50 h-18 flex items-center justify-between">
        <Logo />
        <NavBar />
        <CTA text="Start Now" size="sm" />
      </div>
    </header>
  );
};
export default Header;
