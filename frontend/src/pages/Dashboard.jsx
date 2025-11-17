import useLocalStorage from "../hooks/useLocalStorage";
import { useState, useEffect } from "react";
import useApiAuth from "../hooks/useApiAuth";

import Projects from "../components/dashboard/Projects";
import Header from "../components/dashboard/Header";
import SidePanel from "../components/dashboard/SidePanel";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const [folders] = useState(["All", "Archive"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useLocalStorage("activeFolder", 0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { token, setUser } = useAuth();
  const apiAuth = useApiAuth();

  // Fetch for user object
  useEffect(() => {
    if (!token) return;

    const getUser = async () => {
      try {
        const response = await apiAuth.get("/users/self");
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, [token, apiAuth, setUser]);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-1000 md:h-screen">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="mt-0.5 flex flex-1 min-h-0 flex-col overflow-hidden md:flex-row">
          <SidePanel
            folders={folders}
            active={active}
            setActive={setActive}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <Projects activeFolder={folders[active]} searchQuery={searchQuery} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
