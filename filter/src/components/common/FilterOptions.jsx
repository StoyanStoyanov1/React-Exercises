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
    const objFilter = {
      field: selectedColumn.field,
      value: inputValue,
      operator: operators[selectedColumn.type][selectedOperator],
    };

    handleSetFilter(objFilter);
  };

  return (
    <div className="flex gap-6 items-start">
      <div className="flex flex-col items-start">
        <label className="mb-1 font-bold text-gray-700">Columns</label>
        <select
          value={selectedColumn.label}
          onChange={handleColumnChange}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring focus:ring-gray-200"
        >
          {infoTable.map((col, key) => (
            <option key={key} value={col.label}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-start">
        <label className="mb-1 font-bold text-gray-700">Operators</label>
        <select
          value={selectedOperator}
          onChange={handleOperatorChange}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring focus:ring-gray-200"
        >
          {Object.keys(operators[selectedColumn.type]).map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-start">
        <label className="mb-1 font-bold text-gray-700">Value</label>
        <input
          type={selectedColumn.type}
          placeholder={selectedColumn.label}
          value={inputValue}
          onChange={handleInputChange}
          className="px-3 py-2 border border-gray-300 rounded-lg w-40 focus:outline-none focus:ring focus:ring-gray-200"
        />
      </div>

      <button
        onClick={onSubmit}
        className="mt-5 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Configure
      </button>
    </div>
  );
}

export default FilterOptions;
