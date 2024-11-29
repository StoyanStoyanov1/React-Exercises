import React from "react";
import tables from "../../utils/tables/tables";

const Table = ({values, typeTable}) => {
    const table = tables[typeTable];
    const cols = Object.keys(table);

  const data = [
    { id: 1, title: "Concept A", description: "Description of concept A", value: "42" },
    { id: 2, title: "Concept B", description: "Description of concept B", value: "68" },
    { id: 3, title: "Concept C", description: "Description of concept C", value: "123" },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Table</h2>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            { cols.map(col => (
                <th style={table[col].style}>{table[col].name}</th>
            ))
          
            }
            {/* <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>#</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Title</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Description</th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Value</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{item.id}</td>
              <td style={{ padding: "10px" }}>{item.title}</td>
              <td style={{ padding: "10px" }}>{item.description}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
