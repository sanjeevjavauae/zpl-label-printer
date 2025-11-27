import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TARGET_FIELDS = [
  { key: 'sku', label: 'SKU' },
  { key: 'productName', label: 'Product Name' },
  { key: 'manufacturedDate', label: 'Manufactured Date' },
  { key: 'packagedDate', label: 'Packaged Date' },
  { key: 'expiryDate', label: 'Expiry Date' },
  { key: 'ingredients', label: 'Ingredients' },
  { key: 'price', label: 'Price' },
  { key: 'barcode', label: 'Barcode' },
  { key: 'imageFile', label: 'Image File' } // <-- image column
];

export default function MapperPage() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [preview, setPreview] = useState(null);
  const [zpl, setZpl] = useState(null);
  const [printerIp, setPrinterIp] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setRows([]);
    setHeaders([]);
    setPreview(null);
    setZpl(null);
    setMapping({});
  };

  const uploadGeneric = async () => {
    if (!file) return alert('Choose .xlsx file first');
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await axios.post('http://localhost:8080/api/uploadExcelGeneric', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = res.data;
      setRows(data || []);
      setHeaders(data && data.length > 0 ? Object.keys(data[0]) : []);

      // auto-map fields
      const map = {};
      TARGET_FIELDS.forEach(tf => {
        const found = data && data.length > 0
          ? Object.keys(data[0]).find(h => h.toLowerCase() === tf.key.toLowerCase())
          : '';
        map[tf.key] = found || '';
      });
      setMapping(map);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  useEffect(() => {
    if (!headers || headers.length === 0) return;
    const map = { ...mapping };
    TARGET_FIELDS.forEach(tf => {
      if (!map[tf.key] || map[tf.key] === '') {
        const found = headers.find(h => h.toLowerCase() === tf.key.toLowerCase());
        if (found) map[tf.key] = found;
      }
    });
    setMapping(map);
    // eslint-disable-next-line
  }, [headers]);

  const handleMappingChange = (targetKey, header) => {
    setMapping(prev => ({ ...prev, [targetKey]: header }));
  };

  const buildMappedRows = () => {
    return rows.map(r => {
      const out = {};
      TARGET_FIELDS.forEach(tf => {
        const header = mapping[tf.key];
        out[tf.key] = header ? r[header] ?? '' : '';
      });
      return out;
    });
  };

  const previewServer = async () => {
    const mappedRows = buildMappedRows();
    const res = await axios.post('http://localhost:8080/api/preview', mappedRows );
    setZpl(res.data.zpl || '');
    setPreview(res.data.previewPngBase64 || null);
  };

  const printToNetwork = async () => {
    if (!printerIp) return alert('Enter printer IP');
    const mappedRows = buildMappedRows();
    const res = await axios.post('http://localhost:8080/api/printToNetwork', { mappedRows, printerIp });
    alert('Print sent: ' + JSON.stringify(res.data));
  };

  return (
    <div>
      <h3>1) Upload Excel & Map Fields</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="file" accept=".xlsx" onChange={onFileChange} />
        <button onClick={uploadGeneric}>Upload & Detect Headers</button>
      </div>

      {headers.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4>Detected Headers</h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {headers.map((h, idx) => (
              <div key={idx} style={{ padding: 6, border: '1px solid #ddd', borderRadius: 4 }}>{h}</div>
            ))}
          </div>

          <h4 style={{ marginTop: 12 }}>Field Mapping</h4>
          <table className="table">
            <thead>
              <tr><th>Target Field</th><th>Mapped Column</th></tr>
            </thead>
            <tbody>
              {TARGET_FIELDS.map(tf => (
                <tr key={tf.key}>
                  <td>{tf.label}</td>
                  <td>
                    <select value={mapping[tf.key] || ''} onChange={(e) => handleMappingChange(tf.key, e.target.value)}>
                      <option value=''>-- none --</option>
                      {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <button onClick={previewServer}>Server Preview (Labelary)</button>
            <input
              style={{ marginLeft: 8 }}
              placeholder="Printer IP"
              value={printerIp}
              onChange={e => setPrinterIp(e.target.value)}
            />
            <button style={{ marginLeft: 8 }} onClick={printToNetwork}>Print To Network</button>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <>
          <h4 style={{ marginTop: 12 }}>Sample Data (first 5 rows)</h4>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(rows[0]).map((h, i) => <th key={i}>{h}</th>)}
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((r, idx) => (
                  <tr key={idx}>
                    {Object.keys(r).map((k, i) => <td key={i}>{r[k]}</td>)}
                    <td>
                      {r.imageFile
                        ? <img
                            src={`http://localhost:8080/api/images/${r.imageFile}`}
                            alt={r.productName || 'product'}
                            style={{ width: 100, height: 100 }}
                          />
                        : 'No image'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {preview && (
        <div style={{ marginTop: 12 }}>
          <h4>Server Preview (PNG)</h4>
          <img src={preview} alt="preview" style={{ maxWidth: '100%' }} />
        </div>
      )}

      {zpl && (
        <div style={{ marginTop: 12 }}>
          <h4>Generated ZPL (first labels)</h4>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#111', color: '#0f0', padding: 12, borderRadius: 6 }}>
            {zpl}
          </pre>
        </div>
      )}
    </div>
  );
}
