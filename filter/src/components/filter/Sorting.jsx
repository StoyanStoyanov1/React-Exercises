import { useState } from "react";

import sortUtils from "./sortUtils";

function Sorting ({values}) {

    const [selectedKey, setSelectedKey] = useState('');
    const [sortedData, setSortedData] = useState([]);
    const [order, setOrder] = useState(false);

    const handleSort = () => {
        if (selectedKey === '') return alert('Select your key');

        setSortedData(sortUtils.sortJsonArray(values, selectedKey, !order ? 'asc' : 'desc'))
            
    };

    return (
        <div>
            <label htmlFor="keySelect">Select key</label>
            <select 
            id="KeySelect"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            >
                <option value="">Select key</option>
                {Object.keys(values[0]).map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            <input
                type="checkbox"
                checked={order}
                onChange={() => setOrder(!order)} 
            />

            <button 
            onClick={handleSort}>
                Sort
            </button>

            <h1>Result:</h1>
            <pre>
                {JSON.stringify(sortedData, null, 2)}
            </pre>
        </div>
    )
}

export default Sorting;