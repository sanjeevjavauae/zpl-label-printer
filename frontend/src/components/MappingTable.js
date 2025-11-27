import React from "react";

export default function MappingTable({ mappedRows }) {
  return (
    <div>
      <h3>Mapped Data</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {Object.keys(mappedRows[0]).map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mappedRows.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
