import React from "react";
import tables from "../../utils/tables/tables";

const Table = ({values, typeTable}) => {
    const table = tables[typeTable];
    const cols = Object.keys(table);



  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>{typeTable} Table</h2>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <thead style={{ backgroundColor: "#f4f4f4" }}>
          <tr>
            { cols.map((col, key) => (
                <th key={key} style={table[col].style}>{table[col].name}</th>
                ))
            }
          </tr>
        </thead>
        <tbody>
          {values.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                {cols.map((col, key) => (
                    <td key={key} style={{ padding: "10px" }}>{item[col]}</td>
                ))}
              
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
