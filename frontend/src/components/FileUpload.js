import React from "react";
import { uploadExcel } from "../api";

function FileUpload({ setMappedRows }) {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const json = await uploadExcel(file);
    setMappedRows(json.rows || []);
  };

  return (
    <div>
      <h3>Upload Excel File</h3>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}

export default FileUpload;
