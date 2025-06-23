import NavBar from "./NavBar";
import CTA from "./CTA";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="w-auto border-b-1 border-gray-800">
      <div className="mx-50 flex h-18 items-center justify-between">
        <Logo />
        <NavBar />
        <CTA text="Start Now" size="sm" />
      </div>
    </header>
  );
};
export default Header;
