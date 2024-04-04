import React from "react";
import { useContenctHook } from "../context/contextapi";

const Search = () => {
  const { setSearch } = useContenctHook();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  return (
    <div className="search">
      <label htmlFor="searchingItems">Search</label>
      <input
        type="text"
        onChange={handleSearch}
        name="searchingItems"
        placeholder="Search Names"
        id="searchingItems"
      />
    </div>
  );
};

export default Search;
