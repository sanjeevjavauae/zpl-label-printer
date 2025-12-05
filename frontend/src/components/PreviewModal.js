import React, { useState } from 'react';

export default function PreviewModal({ data, onClose }) {
  const [displaySize, setDisplaySize] = useState({ width: null, height: null });

  if (!data) return null;

  const onImgLoad = (e) => {
    try {
      const naturalW = e.target.naturalWidth || e.target.width;
      const naturalH = e.target.naturalHeight || e.target.height;

      const maxW = Math.min(window.innerWidth * 0.9 - 40, 1200);
      const maxH = Math.min(window.innerHeight * 0.8 - 40, 1000);

      const ratio = Math.min(maxW / naturalW, maxH / naturalH, 1);

      const dispW = Math.round(naturalW * ratio);
      const dispH = Math.round(naturalH * ratio);

      setDisplaySize({ width: dispW, height: dispH });
    } catch (err) {
      setDisplaySize({ width: null, height: null });
    }
  };

  return (
    <div className="modal" onClick={onClose} style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          borderRadius: 8,
          margin: "4vh auto",
          maxWidth: "94vw"
        }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ cursor: "pointer" }}>Close</button>
        </div>

        {data.previewPngBase64 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 14,
              width: displaySize.width ? displaySize.width : "auto",
              height: displaySize.height ? displaySize.height : "auto",
            }}
          >
            <img
              src={data.previewPngBase64}
              alt="Print Preview"
              onLoad={onImgLoad}
              style={{
                width: displaySize.width ? `${displaySize.width}px` : "auto",
                height: displaySize.height ? `${displaySize.height}px` : "auto",
                maxWidth: "94vw",
                maxHeight: "80vh",
                objectFit: "contain",
                border: "1px solid #ccc",
                background: "#fff",
                display: "block",
              }}
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            Preview not available
          </div>
        )}
      </div>
    </div>
  );
}
