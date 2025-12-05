import React, { useState } from "react";
import { generatePreview } from "../api";

export default function PreviewPanel({ mappedRows, preview, setPreview }) {
  const [displaySize, setDisplaySize] = useState({ width: null, height: null });

  const handlePreview = async () => {
    const res = await generatePreview(mappedRows);
    setPreview(res);
    // displaySize will be set when image loads via onImgLoad
    setDisplaySize({ width: null, height: null });
  };

  const onImgLoad = (e) => {
    const naturalW = e.target.naturalWidth || e.target.width;
    const naturalH = e.target.naturalHeight || e.target.height;

    // Choose a sensible max inline width (smaller than modal)
    const maxInlineW = Math.min(360, window.innerWidth * 0.45);
    const maxInlineH = Math.min(400, window.innerHeight * 0.4);

    const ratio = Math.min(maxInlineW / naturalW, maxInlineH / naturalH, 1);
    const dispW = Math.round(naturalW * ratio);
    const dispH = Math.round(naturalH * ratio);

    setDisplaySize({ width: dispW, height: dispH });
  };

  return (
    <div>
      <button onClick={handlePreview}>Generate Preview</button>

      {preview?.previewPngBase64 && (
        <div style={{ width: displaySize.width ? displaySize.width : '100%', maxWidth: 400, marginTop: 20 }}>
          <img
            src={preview.previewPngBase64}
            alt="Preview"
            onLoad={onImgLoad}
            style={{
              width: displaySize.width ? `${displaySize.width}px` : '100%',
              height: displaySize.height ? `${displaySize.height}px` : 'auto',
              objectFit: 'contain',
              border: '1px solid black',
              display: 'block'
            }}
          />
        </div>
      )}
    </div>
  );
}
