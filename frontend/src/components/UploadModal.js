import React, { useState } from 'react';
import { uploadExcelGeneric } from '../api';
import { toast } from 'react-toastify';

export default function UploadModal({ open, onClose }) {
  const [file, setFile] = useState(null);

  if (!open) return null;

  const submit = async () => {
    if (!file) return toast.error('Please choose an Excel (.xlsx) file');

    const fd = new FormData();
    fd.append('file', file);

    try {
      const list = await uploadExcelGeneric(fd);
      toast.success(`Uploaded ${list.length} products`);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error('Upload failed');
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <h3>Upload Products (Excel Only)</h3>

        <div className="form-row">
          <label className="small">
            Upload Excel (.xlsx). The file will be parsed and products stored in memory.
          </label>
          <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files[0])} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={submit}>Upload</button>
        </div>
      </div>
    </div>
  );
}
