import { useState, useEffect } from "react";

import api from "./axios";

const Projects = () => {
  const GET_ROJECTS_URL = "";
  const [projects, setProjects] = useState();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getProjects = async () => {
      api.get();
    };
  }, []);
  return <div>Projects</div>;
};
export default Projects;
