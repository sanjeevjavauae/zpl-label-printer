import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import MappingTable from "./components/MappingTable";
import PreviewPanel from "./components/PreviewPanel";
import PrintButton from "./components/PrintButton";
import "./App.css";

function App() {
  const [mappedRows, setMappedRows] = useState([]);
  const [preview, setPreview] = useState(null);

  return (
    <div className="container">
      <h2>ZPL Label Printer</h2>

      <FileUpload setMappedRows={setMappedRows} />

      {mappedRows.length > 0 && (
        <>
          <MappingTable mappedRows={mappedRows} setMappedRows={setMappedRows} />
          <PreviewPanel mappedRows={mappedRows} setPreview={setPreview} preview={preview} />
          <PrintButton mappedRows={mappedRows} />
        </>
      )}
    </div>
  );
}

export default App;
