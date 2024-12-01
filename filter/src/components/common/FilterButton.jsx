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
    toggleMenu();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        onClick={toggleMenu}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "8px 16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fff",
          color: "#4A4A4A",
          fontSize: "14px",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
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
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="6" y1="12" x2="18" y2="12"></line>
          <line x1="9" y1="18" x2="15" y2="18"></line>
        </svg>
        Filter
      </button>

      {isMenuOpen && (
        
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            marginTop: "-2px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          <FilterOptions infoTable={infoTable} handleSetFilter={handleSetFilter}/>
        </div>
                 
                
      )}
    </div>
  );
};

export default FilterButton;
