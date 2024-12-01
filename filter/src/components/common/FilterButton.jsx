import { useState, useEffect, useRef } from "react";
import FilterOptions from "./FilterOptions";

const FilterButton = ({ infoTable, handleFilter }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSetFilter = (filter) => {
    handleFilter(filter);
    setIsMenuOpen(false); 
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring focus:ring-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="6" y1="12" x2="18" y2="12"></line>
          <line x1="9" y1="18" x2="15" y2="18"></line>
        </svg>
        Filter
      </button>

      {isMenuOpen && (
        <div
          className="absolute top-full left-0 mt-1 p-4 border border-gray-300 rounded-lg bg-white shadow-lg z-10"
          onClick={(e) => e.stopPropagation()} // Предотврати клик затваряне
        >
          <FilterOptions infoTable={infoTable} handleSetFilter={handleSetFilter} />
        </div>
      )}
    </div>
  );
};

export default FilterButton;
