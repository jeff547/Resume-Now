const navLinks = [
  { label: "Home", id: "home" },
  { label: "Benefits", id: "benefits" },
  { label: "Process", id: "process" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const NavBar = ({ orientation = "horizontal", onNavigate = () => {} }) => {
  const isVertical = orientation === "vertical";

  return (
    <nav className={isVertical ? "w-full" : ""}>
      <ul
        className={`flex items-center justify-center gap-1 text-sm sm:gap-2 sm:text-base ${isVertical ? "flex-col gap-2 text-base" : "flex-wrap"}`}
      >
        {navLinks.map((nav, idx) => (
          <li key={idx} className={isVertical ? "w-full" : "w-auto"}>
            <button
              onClick={() => {
                document
                  .getElementById(nav.id)
                  .scrollIntoView({ behavior: "smooth", block: "center" });
                onNavigate();
              }}
              className={`flex cursor-pointer items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text px-4 py-2 text-center text-transparent transition duration-600 hover:from-gray-200 hover:to-gray-400 ${isVertical ? "w-full justify-center rounded-md border border-transparent hover:border-gray-700" : ""}`}
            >
              {nav.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
