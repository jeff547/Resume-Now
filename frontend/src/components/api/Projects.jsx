import { useState, useEffect } from "react";

import useApiAuth from "../../hooks/useApiAuth";
import { useLocation, useNavigate } from "react-router-dom";

const Projects = () => {
  const GET_PROJECTS_URL = "/projects/";

  const [projects, setProjects] = useState();
  const apiAuth = useApiAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        console.log(projects);
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error(err);
        // navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getProjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2 className="text-3xl">My Projects</h2>
      {projects?.length ? (
        <ul>
          {projects.map((project, idx) => (
            <li key={idx}>{project?.title}</li>
          ))}
        </ul>
      ) : (
        <p>No Projects</p>
      )}
    </article>
  );
};
export default Projects;
