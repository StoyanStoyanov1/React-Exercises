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
    Between: "between",
    "Not between": "not_between",
  },
  date: {
    "Is equal to": "eq",
    "Is not equal to": "neq",
    Before: "lt",
    "On or before": "lte",
    After: "gt",
    "On or after": "gte",
    Between: "between",
    "Not between": "not_between",
  },
  string: {
    "Is equal to": "eq",
    "Is not equal to": "neq",
    Contains: "contains",
    "Does not contain": "ncontains",
    "Starts with": "startswith",
    "Ends with": "endswith",
  },
};

function FilterOptions({ infoTable, handleSetFilter, defaultOperator, defaultColumn }) {
  const [selectedOperator, setSelectedOperator] = useState(
    Object.keys(operators[defaultOperator])[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [rangeValues, setRangeValues] = useState({ from: "", to: "" });
  const [selectedColumn, setSelectedColumn] = useState(defaultColumn);

  
  const isDisabled = (name) => {
    const constraints = {};
    if (name === "to" && rangeValues.from) {
      constraints.min = rangeValues.from; 
    }
    if (name === "from" && rangeValues.to) {
      constraints.max = rangeValues.to; 
    }
    return constraints;
  };

  const handleOperatorChange = (e) => {
    setSelectedOperator(e.target.value);
  };

  const handleColumnChange = (e) => {
    setInputValue("");
    setRangeValues({ from: "", to: "" });

    const currentLabel = e.target.value;
    const foundColumn = infoTable.find((col) => col.label === currentLabel);

    setSelectedColumn(foundColumn);

    const firstOperator = Object.keys(operators[foundColumn.type])[0];
    setSelectedOperator(firstOperator);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setRangeValues((prev) => {
      const updatedValues = { ...prev, [name]: value };

      if (name === "from" && updatedValues.to && new Date(value) > new Date(updatedValues.to)) {
        toast.error("The 'From' date cannot be later than the 'To' date.");
        return prev;
      }

      if (name === "to" && updatedValues.from && new Date(value) < new Date(updatedValues.from)) {
        toast.error("The 'To' date cannot be earlier than the 'From' date.");
        return prev;
      }

      return updatedValues;
    });
  };

  const onSubmit = () => {
    const operatorIsBetweenOrNotBetweeen = selectedOperator === "Between" || selectedOperator === "Not between";

    if (operatorIsBetweenOrNotBetweeen) {
      if (!rangeValues.from.trim() || !rangeValues.to.trim()) {
        toast.error("Please provide both 'from' and 'to' values.");
        return;
      }

    } else {
      if (inputValue.trim().length === 0) {
        toast.error("Please select the value you want to filter by.");
        return;
      }

    }

    const objFilter = {
      field: selectedColumn.field,
      value: operatorIsBetweenOrNotBetweeen ? `${rangeValues.from}to${rangeValues.to}` :inputValue.trim(),
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
      maxWidth="1000px"
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

      {selectedOperator === "Between" || selectedOperator === "Not between" ? (
        <Box display="flex" gap={1}>
          <TextField
            size="small"
            label="From"
            type="date"
            name="from"
            placeholder="From"
            value={rangeValues.from} 
            onChange={handleRangeChange}
            inputProps={isDisabled("from")}
          />
          <TextField
            size="small"
            label="To"
            type="date"
            name="to"
            placeholder="To"
            value={rangeValues.to} 
            onChange={handleRangeChange}
            inputProps={isDisabled("to")}
          />
        </Box>
      ) : (
        <TextField
          size="small"
          label={selectedColumn.label}
          type={selectedColumn.type}
          placeholder={`Enter ${selectedColumn.label}`}
          value={inputValue}
          onChange={handleInputChange}
          sx={{ flex: 1 }}
        />
      )}

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
