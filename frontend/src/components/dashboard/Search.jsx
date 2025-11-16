import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Search = ({ searchQuery, setSearchQuery, className = "" }) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={`${focus ? "border border-blue-400" : ""} flex items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-sm ${className}`}
    >
      <FontAwesomeIcon icon={faSearch} className=" text-gray-400" />
      <input
        type="text"
        id="search"
        autoComplete="off"
        placeholder="Search"
        value={searchQuery}
        className="w-full bg-transparent text-gray-200 focus:outline-none"
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </div>
  );
};
export default Search;
