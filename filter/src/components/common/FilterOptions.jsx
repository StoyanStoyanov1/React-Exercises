import React, { useState } from "react";

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
    }
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
    const objFilter = { 
      field: selectedColumn.field, 
      value: inputValue, 
      operator: operators[selectedColumn.type][selectedOperator] 
    };

    handleSetFilter(objFilter);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <label style={{ marginBottom: "4px", fontWeight: "bold" }}>Columns</label>
        <select
          value={selectedColumn.label}
          onChange={handleColumnChange}
          style={{
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#fff",
          }}
        >
          {infoTable.map((col, key) => (
            <option key={key} value={col.label}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <label style={{ marginBottom: "4px", fontWeight: "bold" }}>Operators</label>
        <select
          value={selectedOperator}
          onChange={handleOperatorChange}
          style={{
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#fff",
          }}
        >
          {Object.keys(operators[selectedColumn.type]).map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <label style={{ marginBottom: "4px", fontWeight: "bold" }}>Value</label>
        <input
          type={selectedColumn.type}
          placeholder={selectedColumn.label}
          style={{
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "150px",
          }}
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>

      <button
        style={{
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#007bff",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: "18px", 
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
        onClick={onSubmit}
      >
        Configure
      </button>
    </div>
  );
}

export default FilterOptions;
