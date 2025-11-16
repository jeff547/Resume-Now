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
        return a.title.localeCompare(b.title);
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
      <main className="flex-1 min-h-0 overflow-y-auto px-6 py-8 sm:px-8 lg:px-12 xl:px-24">
        {/* Header */}
        <div className="relative flex flex-wrap items-end justify-between gap-3 pb-6">
          <h2 className="text-2xl">{activeFolder} Projects</h2>
          <div ref={projectSortByRef} className="relative text-sm">
            <h1
              className="cursor-pointer text-gray-600"
              onClick={() => setSortByDropdown(!sortByDropdown)}
            >
              {sortBys[activeSortBy]}
              <FontAwesomeIcon icon={faAngleDown} className="pl-1" />
            </h1>
            {/* Sortby Dropdown */}
            <div
              className={`absolute right-0 top-8 w-40 rounded-lg bg-gray-800 p-1 text-xs shadow-lg shadow-gray-1000 transition ${sortByDropdown ? "visible opacity-100" : "invisible opacity-0"}`}
            >
              <ul>
                {sortBys.map((sortBy, idx) => (
                  <li key={idx}>
                    <button
                      className="flex items-center hover:bg-purple-600 w-full gap-2 rounded-md"
                      onClick={() => {
                        setActiveSortBy(idx);
                        setSortByDropdown(false);
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
            className="grid justify-center gap-4 md:gap-5"
            ref={projectSettingsRef}
            style={{
              gridTemplateColumns: "repeat(auto-fill,minmax(180px,220px))",
            }}
          >
            {filteredProjects.map((project, idx) => (
              <li key={idx} className="flex">
                <div className="flex w-full min-w-[160px] flex-col overflow-hidden rounded-lg bg-gray-950">
                  {/* Temporary add image */}
                  <figure className="aspect-[4/5] w-full bg-white" />
                  <div className="flex flex-1 flex-col gap-2 p-2.5">
                    <h1 className="block pb-0.5 text-sm leading-tight">
                      {project?.title}
                    </h1>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center text-xs">
                        <FontAwesomeIcon
                          icon={faFile}
                          className="text-blue-400"
                        />
                        <p className="pl-1">
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
                          className="flex h-6 w-6 items-center justify-center rounded-full p-1 text-sm hover:bg-gray-800"
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
                          className={`absolute right-0 top-7 w-36 rounded-lg border border-gray-600 bg-gray-800 px-1 py-1 text-xs shadow-black shadow-lg ${idx === openProjectSettings ? "visible" : "invisible"}`}
                        >
                          <ul>
                            {projectOptions.map((option, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <button
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-md hover:bg-purple-600"
                                  onClick={option.handleClick}
                                >
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
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-1 text-center">
            <h1>No Results</h1>
            <h3 className="text-sm text-gray-600">
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
