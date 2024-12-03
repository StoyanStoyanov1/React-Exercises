import React from "react";
import { TextField, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchInput() {
  return (
    <Box className="flex items-center border border-gray-300 rounded-md shadow-sm overflow-hidden">
      <TextField
        variant="standard"
        placeholder="Search"
        InputProps={{
          disableUnderline: true, 
        }}
        className="flex-grow px-3 py-1.5 text-sm"
      />

      <IconButton
        className="p-2 text-gray-500 hover:text-gray-700"
        aria-label="search"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default SearchInput;
