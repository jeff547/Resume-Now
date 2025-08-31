import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const CreateButton = () => {
  return (
    <Link
      to={"/create"}
      className="flex items-center gap-1 button py-2 px-2.5 text-xs"
    >
      <FontAwesomeIcon icon={faPlus} />
      New Project
    </Link>
  );
};
export default CreateButton;
