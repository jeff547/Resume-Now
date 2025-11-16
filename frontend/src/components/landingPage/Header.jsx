import { useState } from "react";
import { Menu, X } from "lucide-react";
import NavBar from "./NavBar";
import CTA from "./CTA";
import Logo from "../common/Logo";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = () => setMenuOpen(false);

  return (
    <header className="z-20 border-b-1 sticky top-0 w-full border-gray-800 bg-black">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Logo />
        <div className="hidden flex-1 items-center justify-end gap-6 sm:flex">
          <NavBar onNavigate={handleNavigate} />
          <CTA text="Start Now" size="sm" />
        </div>
        <button
          className="flex items-center justify-center rounded-md border border-gray-800 p-2 text-gray-300 transition hover:border-gray-700 hover:text-white sm:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={`sm:hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden border-t border-gray-800 transition-all duration-300`}
      >
        <div className="flex flex-col gap-4 px-4 py-4">
          <NavBar orientation="vertical" onNavigate={handleNavigate} />
          <CTA text="Start Now" size="sm" />
        </div>
      </div>
    </header>
  );
};
export default Header;
