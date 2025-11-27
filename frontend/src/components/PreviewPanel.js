import React from "react";
import { generatePreview } from "../api";

export default function PreviewPanel({ mappedRows, preview, setPreview }) {
  const handlePreview = async () => {
    const res = await generatePreview(mappedRows);
    setPreview(res);
  };

  return (
    <div>
      <button onClick={handlePreview}>Generate Preview</button>

      {preview?.previewPngBase64 && (
        <img
          src={preview.previewPngBase64}
          alt="Preview"
          style={{ marginTop: 20, width: "300px", border: "1px solid black" }}
        />
      )}
    </div>
  );
}
