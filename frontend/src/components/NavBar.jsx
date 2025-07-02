const navLinks = [
  { label: "Home", id: "home" },
  { label: "Benefits", id: "benefits" },
  { label: "Process", id: "process" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const NavBar = () => {
  return (
    <nav>
      <ul className="flex items-center">
        {navLinks.map((nav, idx) => (
          <li key={idx}>
            <button
              onClick={() => {
                document
                  .getElementById(nav.id)
                  .scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text px-4 py-2 text-transparent transition duration-600 hover:from-gray-200 hover:to-gray-400"
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
