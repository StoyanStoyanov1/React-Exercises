import { useState } from "react";
import { Box, Button, Menu, MenuItem, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterOptions from "./FilterOptions";

const FilterButton = ({ infoTable, path}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const toggleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="relative">
      <Button
        onClick={toggleMenu}
        variant="outlined"
        startIcon={<FilterListIcon />}
        sx={{
          textTransform: "none",
          borderColor: "#d1d5db", 
          color: "#374151", 
          ":hover": {
            backgroundColor: "#f9fafb", 
          },
        }}
        className="shadow-sm hover:shadow-md" 
      >
        Filter
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          className: "border border-gray-300 rounded-lg shadow-lg", 
          sx: {
            mt: 1,
          },
        }}
      >
        <MenuItem disableRipple className="p-4">
          <FilterOptions
            path={path}
            infoTable={infoTable}
            defaultOperator={infoTable[0].type}
            defaultColumn={infoTable[0]}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FilterButton;
  