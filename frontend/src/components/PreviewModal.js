import React from 'react';

export default function PreviewModal({ data, onClose }) {
  if (!data) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>Preview</h3>
          <button onClick={onClose}>Close</button>
        </div>
        {data.previewPngBase64 ? (
    <div style={{
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
        border: "1px solid #ccc",
        padding: "10px",
        background: "#fff"
    }}>
        <img
            src={data.previewPngBase64}
            alt="Preview"
            style={{
                width: "100%",   // Always scale properly
                height: "auto",  // Maintain aspect ratio
                display: "block"
            }}
        />
    </div>
) : (
    <pre style={{
        background:'#000',
        color:'#0f0',
        padding:12,
        maxHeight: "90vh",
        overflow: "auto"
    }}>
        {data.zpl}
    </pre>
)}

      </div>
    </div>
  );
}
