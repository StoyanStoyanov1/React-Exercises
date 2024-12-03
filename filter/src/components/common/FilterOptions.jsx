import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
} from "@mui/material";

const operators = {
  number: {
    "==": "eq",
    ">": "gt",
    ">=": "gte",
    "<=": "lte",
    "<": "lt",
    "!=": "neq",
  },
  date: {
    "Is equal to": "eq",
    "Is not equal to": "neq",
    "Before": "lt",
    "On or before": "lte",
    "After": "gt",
    "On or after": "gte",
    "Between": "between",
    "Not between": "not_between",
  },
  string: {
    "Is equal to": "eq",
    "Is not equal to": "neq",
    "Contains": "contains",
    "Does not contain": "ncontains",
    "Starts with": "startswith",
    "Ends with": "endswith",
  },
};

function FilterOptions({ infoTable, handleSetFilter }) {
  const [selectedOperator, setSelectedOperator] = useState(
    Object.keys(operators[infoTable[0].type])[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(infoTable[0]);

  const handleOperatorChange = (e) => {
    setSelectedOperator(e.target.value);
  };

  const handleColumnChange = (e) => {
    const currentLabel = e.target.value;

    const foundColumn = infoTable.find((col) => col.label === currentLabel);

    setSelectedColumn(foundColumn);

    setSelectedOperator(Object.keys(operators[foundColumn.type])[0]);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const onSubmit = () => {
    if (inputValue.trim().length === 0) {
      toast.error("Please select the value you want to filter by.");
      return; 
    }

    const objFilter = {
      field: selectedColumn.field,
      value: inputValue.trim(),
      operator: operators[selectedColumn.type][selectedOperator],
    };

    handleSetFilter(objFilter);

  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      p={2}
      bgcolor="white"
      boxShadow={2}
      borderRadius={2}
      maxWidth="800px"  
      mx="auto"
    >
      <FormControl size="small" sx={{ minWidth: "150px" }}>
        <InputLabel>Columns</InputLabel>
        <Select
          value={selectedColumn.label}
          onChange={handleColumnChange}
          label="Columns"
        >
          {infoTable.map((col, key) => (
            <MenuItem key={key} value={col.label}>
              {col.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: "150px" }}>
        <InputLabel>Operators</InputLabel>
        <Select
          value={selectedOperator}
          onChange={handleOperatorChange}
          label="Operators"
        >
          {Object.keys(operators[selectedColumn.type]).map((op) => (
            <MenuItem key={op} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Value"
        placeholder={`Enter ${selectedColumn.label}`}
        value={inputValue}
        onChange={handleInputChange}
        sx={{ flex: 1 }}
      />

      <Button
        onClick={onSubmit}
        variant="contained"
        color="primary"
        sx={{
          fontSize: "0.875rem",
          height: "40px",
        }}
      >
        Configure
      </Button>

    </Box>
  );
}

export default FilterOptions;
