import { useState, useEffect, useRef } from "react";
import {
  faAngleDown,
  faFile,
  faEllipsisV,
  faCheck,
  faTrash,
  faPenToSquare,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useApiAuth from "../../hooks/useApiAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import Modal from "../common/Modal";

const Projects = ({ activeFolder, searchQuery }) => {
  const GET_PROJECTS_URL = "/projects/";

  const projectSettingsRef = useRef();
  const projectSortByRef = useRef();
  const apiAuth = useApiAuth();

  const [projects, setProjects] = useState([]);
  const [activeSortBy, setActiveSortBy] = useLocalStorage("sortBy", 0);
  const [openProjectSettings, setOpenProjectSettings] = useState(-1);
  const [sortByDropdown, setSortByDropdown] = useState(false);
  const [openRenameProject, setOpenRenameProject] = useState(false);

  const sortBys = ["Last viewed by me", "Last Created", "Alphabetically"];
  const projectOptions = [
    {
      label: "Rename",
      icon: faPenToSquare,
      handleClick: () => setOpenRenameProject(true),
    },
    {
      label: "Remove",
      icon: faTrash,
      handleClick: () => {},
    },
    {
      label: "Open in new tab",
      icon: faArrowUpRightFromSquare,
      handleClick: () => {},
    },
  ];

  // Projects Query
  const filteredProjects = projects
    ?.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    ?.sort((a, b) => {
      if (activeSortBy === 0) {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (activeSortBy === 1) {
        return new Date(b.last_opened) - new Date(a.last_opened);
      } else if (activeSortBy === 2) {
        a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Close dropdown when click outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Project Settings
      if (
        projectSettingsRef.current &&
        !projectSettingsRef.current.contains(event.target)
      ) {
        setOpenProjectSettings(-1);
      }

      // Project Sortby
      if (
        projectSortByRef.current &&
        !projectSortByRef.current.contains(event.target)
      ) {
        setSortByDropdown(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fetch for the projects in database
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getProjects = async () => {
      try {
        const response = await apiAuth.get(GET_PROJECTS_URL, {
          signal: controller.signal,
        });

        console.log(response.data.data);
        // If mounted, update projects
        isMounted && setProjects(response.data.data);
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error(err);
      }
    };

    getProjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      {/* Rename Project Modal */}
      <Modal
        open={openRenameProject}
        onClose={() => setOpenRenameProject(false)}
      >
        <div>
          <h3>Rename</h3>
        </div>
      </Modal>

      {/* Main Projects Section */}
      <main className="px-24 py-8 w-full">
        {/* Header */}
        <div className="pb-6 relative">
          <h2 className="text-2xl">{activeFolder} Projects</h2>
          <div ref={projectSortByRef} className="w-fit">
            <h1
              className="text-gray-600 text-sm cursor-pointer "
              onClick={() => setSortByDropdown(!sortByDropdown)}
            >
              {sortBys[0]}
              <FontAwesomeIcon icon={faAngleDown} className="pl-1" />
            </h1>
            {/* Sortby Dropdown */}
            <div
              className={`bg-gray-800 shadow-lg p-1 w-36 rounded-lg text-xs absolute top-14 shadow-gray-1000 ${sortByDropdown ? "visible" : "hidden"}`}
            >
              <ul>
                {sortBys.map((sortBy, idx) => (
                  <li key={idx}>
                    <button
                      className="flex items-center hover:bg-purple-600 w-full gap-2 rounded-md"
                      onClick={() => {
                        setActiveSortBy(idx);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={`text-xs ${activeSortBy == idx ? "visible" : "invisible"}`}
                      />
                      <p className="my-1">{sortBy}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects?.length ? (
          <ul
            className="grid grid-cols-3 md:grid-cols-5 gap-6"
            ref={projectSettingsRef}
          >
            {filteredProjects.map((project, idx) => (
              <li key={idx}>
                <div className="cursor-pointer min-w-[180px]">
                  {/* Temporary add image */}
                  <figure className="bg-white h-[300px]"></figure>
                  <div className="p-3 bg-gray-950 ">
                    <h1 className="text-sm block pb-0.5">{project?.title}</h1>
                    <div className="flex items-center justify-between">
                      <div>
                        <FontAwesomeIcon
                          icon={faFile}
                          className="text-blue-400 inline"
                        />
                        <p className="text-xs pl-1 inline">
                          {new Date(project?.last_opened).toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "UTC",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      {/* Project Settings*/}
                      <section className="relative">
                        <button
                          className="flex rounded-4xl w-5 h-5 hover:bg-gray-800 items-center justify-center p-1 text-sm"
                          // Reset toggle if dropdown is already active
                          onClick={() => {
                            openProjectSettings === idx
                              ? setOpenProjectSettings(-1)
                              : setOpenProjectSettings(idx);
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>
                        {/* Project Settings Dropdown */}
                        <div
                          className={`bg-gray-800 shadow-lg px-1 py-1 rounded-lg w-36 text-xs absolute shadow-black border border-gray-600 ${idx === openProjectSettings ? "visible" : "invisible"}`}
                        >
                          <ul>
                            {projectOptions.map((option, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <button className="flex items-center hover:bg-purple-600 w-full gap-2 rounded-md cursor-pointer">
                                  <FontAwesomeIcon icon={option.icon} />
                                  <p className="my-1">{option.label}</p>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col text-center items-center justify-center gap-1 mt-[18vw]">
            <h1 className="">No Results</h1>
            <h3 className="text-gray-600 text-sm">
              Try using different keywords <br />
              and searching again.
            </h3>
          </div>
        )}
      </main>
    </>
  );
};
export default Projects;
