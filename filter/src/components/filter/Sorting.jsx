import { useState, useEffect } from "react";
import sortUtils from "./sortUtils";

function Sorting({ values }) {
  const [selectedKey, setSelectedKey] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [order, setOrder] = useState(false);
  const [minNumber, setMinNumber] = useState(null);
  const [maxNumber, setMaxNumber] = useState(null);

  useEffect(() => {
    if (selectedKey !== "" && sortUtils.typeValidators.isNumber(values[0][selectedKey])) {
      const allValues = values.map((item) => Number(item[selectedKey]));
      const min = Math.min(...allValues);
      const max = Math.max(...allValues);

      setMinNumber(min);
      setMaxNumber(max);
    }
  }, [selectedKey, values]);

  const handleSort = () => {
    if (selectedKey === "") return alert("Select your key");

    const minNumberValid = minNumber !== null && !isNaN(minNumber) ? Number(minNumber) : null;
    const maxNumberValid = maxNumber !== null && !isNaN(maxNumber) ? Number(maxNumber) : null;

    if (minNumberValid !== null && maxNumberValid !== null && minNumberValid > maxNumberValid) {
        return alert("Minimum number cannot be greater than the maximum number.");
    }

    const filteredData = sortUtils.filterByNumberRange(values, selectedKey, minNumberValid, maxNumberValid);

    const sortedData = sortUtils.sortJsonArray(filteredData, selectedKey, !order ? "asc" : "desc");

    setSortedData(sortedData);
};


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label htmlFor="keySelect">Select key:</label>
      <select
        id="KeySelect"
        value={selectedKey}
        onChange={(e) => setSelectedKey(e.target.value)}
        style={{ maxWidth: "150px" }}
      >
        <option value="">Select key</option>
        {Object.keys(values[0]).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      {selectedKey !== "" && sortUtils.typeValidators.isNumber(values[0][selectedKey]) && (
        <>
          <div>
            <label htmlFor="minNumber">Min Number:</label>
            <input
              id="minNumber"
              type="number"
              value={minNumber || ""}
              min={Math.min(...values.map((item) => Number(item[selectedKey])))}
              onChange={(e) => setMinNumber(Number(e.target.value))}
              style={{ maxWidth: "100px" }}
            />
          </div>

          <div>
            <label htmlFor="maxNumber">Max Number:</label>
            <input
              id="maxNumber"
              type="number"
              value={maxNumber || ""}
              min={minNumber}
              max={Math.max(...values.map((item) => Number(item[selectedKey])))}
              onChange={(e) => setMaxNumber(Number(e.target.value))}
              style={{ maxWidth: "100px" }}
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="order">Decrease:</label>
        <input
          id="order"
          type="checkbox"
          checked={order}
          onChange={() => setOrder(!order)}
        />
      </div>

      <button style={{ maxWidth: "100px" }} onClick={handleSort}>
        Sort
      </button>

      <h1>Result:</h1>
      <pre>{JSON.stringify(sortedData, null, 2)}</pre>
    </div>
  );
}

export default Sorting;
