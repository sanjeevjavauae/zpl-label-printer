import React from "react";
import UploadExcel from "./UploadExcel"; // make sure the path is correct

export default function App() {
  return (
    <div className="container">
      <div className="header">
        <h2>Label Printer — Upload & Preview</h2>
      </div>
      <UploadExcel />
    </div>
  );
}
