const navLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Benefits", href: "#" },
  { label: "Process", href: "#" },
  { label: "Contact", href: "#" },
];

const NavBar = () => {
  return (
    <nav>
      <ul className="flex items-center">
        {navLinks.map((nav, idx) => (
          <li key={idx}>
            <button className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text px-4 py-2 text-transparent transition duration-600 hover:from-gray-200 hover:to-gray-400">
              {nav.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
