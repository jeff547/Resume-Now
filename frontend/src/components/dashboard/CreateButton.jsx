import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const CreateButton = ({ iconOnly = false, className = "" }) => {
  const baseClasses = iconOnly
    ? "button flex items-center justify-center gap-1 py-1.5 px-2 text-md"
    : "button flex items-center gap-1 py-2 px-2.5 text-xs";

  return (
    <Link
      to={"/create"}
      aria-label={iconOnly ? "Create new project" : undefined}
      className={`${baseClasses} ${className}`}
    >
      <FontAwesomeIcon icon={faPlus} />
      {!iconOnly && "New Project"}
    </Link>
  );
};
export default CreateButton;
