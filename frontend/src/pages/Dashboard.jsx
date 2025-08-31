import useLocalStorage from "../hooks/useLocalStorage";
import { useState, useEffect } from "react";
import useApiAuth from "../hooks/useApiAuth";

import Projects from "../components/dashboard/Projects";
import Header from "../components/dashboard/Header";
import SidePanel from "../components/dashboard/SidePanel";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const [folders, setFolders] = useState(["All", "Archive"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useLocalStorage("activeFolder", 0);
  const { setUser } = useAuth();
  const apiAuth = useApiAuth();

  // Fetch for user object
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiAuth.get("/users/self");
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, []);

  return (
    <>
      <div className="bg-gray-1000 min-h-screen">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="flex mt-0.5">
          <SidePanel folders={folders} active={active} setActive={setActive} />
          <Projects activeFolder={folders[active]} searchQuery={searchQuery} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
