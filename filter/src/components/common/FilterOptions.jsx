import React, { useState } from "react";

const operators = {
    number: {
        ">": "gt",
        ">=": "gte",
        "<=": "lte",
        "<": "lt",
        "==": "eq",
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

function FilterOptions({ col, handleSetFilter }) {
  const [selectedOperator, setSelectedOperator] = useState(">"); 
  const [inputValue, setInputValue] = useState(""); 

  const handleOperatorChange = (e) => {
    setSelectedOperator(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const onSubmit = () => {
    const objFilter = { 
        field: col.field, 
        value: inputValue, 
        operator: operators[col.type][selectedOperator] }

    handleSetFilter(objFilter);
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
      }}
    >
      
    
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
            {Object.keys(operators[col.type]).map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          <input
            type={col.type}
            placeholder={col.label}
            style={{
              padding: "4px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "150px",
            }}
            value={inputValue}
            onChange={handleInputChange}
          />

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
