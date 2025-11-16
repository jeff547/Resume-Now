import logo from "../../assets/images/logo.png";
import Search from "./Search";
import CreateButton from "./CreateButton";
import { useNavigate } from "react-router-dom";

const Header = ({
  searchQuery,
  setSearchQuery,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-1100 px-4 py-4 md:px-8">
      {/* Mobile Layout */}
      <div className="hidden flex-col gap-4 max-[500px]:flex">
        <h1
          className="flex cursor-pointer items-center justify-center gap-2 font-normal text-gray-100"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="w-5" />
          ResumeNow
        </h1>
        <div className="flex w-full flex-wrap items-center gap-3">
          <Search
            className="min-w-[150px] flex-1 px-2"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div className="flex-shrink-0">
            <CreateButton iconOnly />
          </div>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="ml-auto rounded-full border border-gray-800 bg-gray-950/60 px-3 py-1 text-lg leading-none text-gray-500 transition hover:border-gray-700 hover:bg-gray-950 hover:text-gray-100"
            aria-expanded={isSidebarOpen}
            aria-controls="dashboard-sidebar"
          >
            ⋮
            <span className="sr-only">
              {isSidebarOpen ? "Hide folders" : "Show folders"}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex items-center justify-between max-[500px]:hidden">
        <h1
          className="flex cursor-pointer items-center gap-2 font-normal text-gray-100"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="w-5" />
          ResumeNow
        </h1>
        <div className="flex flex-1 items-center justify-center gap-3 px-4">
          <Search
            className="w-full max-w-md md:px-6"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <CreateButton />
      </div>
    </div>
  );
};

export default Header;
