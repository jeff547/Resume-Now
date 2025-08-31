import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HashLink = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    }
  }, [location]);

  return null;
};

export default HashLink;
