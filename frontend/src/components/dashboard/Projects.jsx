import { useState, useEffect, useRef, useCallback } from "react";
import {
  faAngleDown,
  faFile,
  faEllipsisV,
  faCheck,
  faTrash,
  faPenToSquare,
  faSpinner,
  faArrowUpRightFromSquare,
  faXmark,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useApiAuth from "../../hooks/useApiAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import Modal from "../common/Modal";

const Projects = ({ activeFolder, searchQuery }) => {
  const projectSettingsRef = useRef();
  const projectSortByRef = useRef();
  const apiAuth = useApiAuth();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sorting States
  const [activeSortBy, setActiveSortBy] = useLocalStorage("sortBy", 0);
  const [sortByDropdown, setSortByDropdown] = useState(false);
  const sortBys = ["Last viewed by me", "Last Created", "Alphabetically"];

  // Dropdown Management
  const [openProjectSettingsId, setOpenProjectSettingsId] = useState(null);

  // Rename Logic State
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  // --- ACTIONS ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await apiAuth.delete(`/resumes/${id}`);
      // Update UI
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setOpenProjectSettingsId(null);
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const prepareRename = (project) => {
    setProjectToRename(project);
    setNewTitle(project.title); // temporary prefill
    setIsRenameModalOpen(true);
    setOpenProjectSettingsId(null); // Close dropdown
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!projectToRename) return;

    try {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectToRename.id ? { ...p, title: newTitle } : p,
        ),
      );

      const response = await apiAuth.patch(`/resumes/${projectToRename.id}`, {
        title: newTitle,
      });

      console.log(response);

      setIsRenameModalOpen(false);
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  const handleRegenerate = async (id) => {
    try {
      setOpenProjectSettingsId(false);

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "generating" } : p)),
      );

      const response = await apiAuth.patch(`/resumes/${id}/regenerate`);

      console.log(response.data);
    } catch (err) {
      console.error("Regeneration failed", err);

      alert("Failed to trigger regeneration.");

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "error" } : p)),
      );
    }
  };

  // Projects Query
  const filteredProjects = projects
    ?.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()),
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

  // --- EFFECTS ---

  // Close dropdown when click outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Project Settings
      if (
        projectSettingsRef.current &&
        !projectSettingsRef.current.contains(event.target)
      ) {
        setOpenProjectSettingsId(null);
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
  const fetchProjects = useCallback(
    async (showLoading = false) => {
      if (showLoading) setIsLoading(true);

      try {
        const response = await apiAuth.get("/resumes/");

        console.log(response.data);
        // If mounted, update projects
        setProjects(response.data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [apiAuth],
  );

  // Inital Load
  useEffect(() => {
    fetchProjects(true);
  }, [fetchProjects]);

  // Polling every five seconds
  useEffect(() => {
    const isGenerating = projects.some((p) => p.status === "generating");
    if (!isGenerating) return;

    console.log("🔄 Polling for updates...");

    const interval = setInterval(() => {
      fetchProjects(false);
    }, 15000);

    return () => clearInterval(interval);
  }, [projects, fetchProjects]);

  return (
    <>
      {/* Rename Project Modal */}
      <Modal
        open={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
      >
        <div className="w-96 rounded-xl border border-gray-700 bg-gray-900 p-6 text-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Rename Project</h3>
            <button
              onClick={() => setIsRenameModalOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <form onSubmit={handleRename}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-6 w-full rounded-lg border border-gray-600 bg-gray-800 p-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsRenameModalOpen(false)}
                className="rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Main Projects Section */}
      <main className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-8 lg:px-12 xl:px-24">
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
              className={`shadow-gray-1000 absolute right-0 top-8 w-40 rounded-lg bg-gray-800 p-1 text-xs shadow-lg transition ${sortByDropdown ? "visible opacity-100" : "invisible opacity-0"}`}
            >
              <ul>
                {sortBys.map((sortBy, idx) => (
                  <li key={idx}>
                    <button
                      className="flex w-full items-center gap-2 rounded-md hover:bg-purple-600"
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

        {/* --- LOADING STATE --- */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center text-gray-500">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          </div>
        )}

        {/* Projects Display */}
        {!isLoading &&
          (filteredProjects?.length ? (
            <ul
              className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6"
              ref={projectSettingsRef}
            >
              {filteredProjects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => {
                    if (project.download_url) {
                      window.open(project.download_url, "_blank");
                    } else if (project.status === "generating") {
                      alert("Resume is still generating...");
                    }
                  }}
                  className="group relative flex flex-col rounded-xl border border-gray-800 bg-gray-900 transition-all hover:border-purple-500/50 hover:shadow-lg"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-xl bg-gray-800">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="h-full w-full rounded-t-xl object-cover object-top opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                        onError={(e) => {
                          e.target.style.display = "none"; // Hide broken images
                          e.target.nextSibling.style.display = "flex"; // Show fallback
                        }}
                      />
                    ) : null}

                    {/* Fallback Icon */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-700 ${project.thumbnail_url ? "hidden" : "flex"}`}
                    >
                      <FontAwesomeIcon icon={faFile} size="3x" />
                    </div>
                    {/* Generating Icon */}
                    {project.status === "generating" && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 text-purple-400 backdrop-blur-sm">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          size="2x"
                          className="mb-2"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Processing
                        </span>
                      </div>
                    )}
                  </div>

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
                            },
                          )}
                        </p>
                      </div>
                      {/* Project Settings*/}
                      <div className="relative">
                        <button
                          className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-700 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenProjectSettingsId(
                              openProjectSettingsId === project.id
                                ? null
                                : project.id,
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} size="sm" />
                        </button>
                        {/* Project Settings Dropdown */}
                        {openProjectSettingsId === project.id && (
                          <div
                            className="absolute right-1 top-8 z-50 w-40 rounded-lg border border-gray-700 bg-gray-800 p-1 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Rename Button */}
                            <button
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-gray-200 hover:bg-purple-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                prepareRename(project);
                              }}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} /> Rename
                            </button>

                            {/* Regenerate Button */}
                            <button
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-blue-400 hover:bg-blue-900/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRegenerate(project.id);
                              }}
                            >
                              <FontAwesomeIcon icon={faRotate} /> Regenerate
                            </button>

                            {/* Delete Button */}
                            <button
                              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-red-400 hover:bg-red-900/30"
                              onClick={(e) => {
                                e.stopPropagation(); // Explicitly stop for delete
                                handleDelete(project.id);
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>

                            {/* Open in new tab */}
                            {project.download_url && (
                              <a
                                href={project.download_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-gray-200 hover:bg-purple-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FontAwesomeIcon
                                  icon={faArrowUpRightFromSquare}
                                />{" "}
                                Open PDF
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center text-gray-500">
              <div className="mb-4 text-6xl opacity-20">
                <FontAwesomeIcon icon={faFile} />
              </div>
              <h2 className="text-xl font-semibold text-gray-400">
                No Projects Found
              </h2>
              <p className="mt-2 text-sm">
                Try creating a new resume or changing your search.
              </p>
            </div>
          ))}
      </main>
    </>
  );
};

export default Projects;
