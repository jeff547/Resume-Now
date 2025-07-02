import NavBar from "./NavBar";
import Button from "./Button";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="anima sticky top-0 w-auto border-b-1 border-gray-800 bg-black">
      <div className="mx-50 flex h-18 items-center justify-between">
        <Logo />
        <NavBar />
        <Button text="Start Now" size="sm" />
      </div>
    </header>
  );
};
export default Header;
