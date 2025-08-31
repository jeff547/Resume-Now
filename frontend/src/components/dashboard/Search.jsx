import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Search = ({ searchQuery, setSearchQuery }) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={`${focus ? "border border-blue-400" : ""} flex items-center gap-1 bg-gray-900 rounded-md px-3 text-sm py-1.5 md:min-w-sm`}
    >
      <FontAwesomeIcon icon={faSearch} className=" text-gray-400" />
      <input
        type="text"
        id="search"
        autoComplete="off"
        placeholder="Search"
        value={searchQuery}
        className="focus:outline-none"
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
};
export default Search;
