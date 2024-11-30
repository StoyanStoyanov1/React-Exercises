import React from "react";

const Table = ({values, tableHeaderStyles, infoTable}) => {
    
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <thead style={tableHeaderStyles}>
          <tr>
            { infoTable.map((col, key) => (
                <th key={key} style={{...col.style, padding: '15px'}}>{col.label}</th>
                ))
            }
          </tr>
        </thead>
        <tbody>
          {values.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                {infoTable.map((col, key) => (
                    <td key={key} style={{ padding: "10px" }}>{item[col.field]}</td>
                ))}
              
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
