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
  { key: 'logoPath', label: 'Logo Path' }
];

export default function MapperPage(){
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
    const res = await axios.post('http://localhost:8080/api/uploadExcelGeneric', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const data = res.data;
    setRows(data || []);
    setHeaders(data && data.length > 0 ? Object.keys(data[0]) : []);
    // initialize default mapping (try to auto-match similar names)
    const map = {};
    TARGET_FIELDS.forEach(tf => {
      // try to find header that matches label (case-insensitive partial)
      const found = headers.find(h => h && h.toLowerCase().includes(tf.label.toLowerCase().split(' ')[0]));
      map[tf.key] = found || "";
    });
    setMapping(map);
  };

  // Update mapping when headers change: trying autopopulate
  useEffect(() => {
    if (!headers || headers.length === 0) return;
    const map = {...mapping};
    TARGET_FIELDS.forEach(tf => {
      if (!map[tf.key] || map[tf.key] === "") {
        const found = headers.find(h => h && h.toLowerCase().includes(tf.label.toLowerCase().split(' ')[0]));
        if (found) map[tf.key] = found;
      }
    });
    setMapping(map);
    // eslint-disable-next-line
  }, [headers]);

  const handleMappingChange = (targetKey, header) => {
    const m = {...mapping};
    m[targetKey] = header;
    setMapping(m);
  };

  const buildMappedRows = () => {
    // mappedRows is list of objects where keys are target field names and values are values from each row
    return rows.map(r => {
      const out = {};
      TARGET_FIELDS.forEach(tf => {
        const header = mapping[tf.key];
        out[tf.key] = header ? (r[header] ?? "") : "";
      });
      return out;
    });
  };

  const previewServer = async () => {
    const mappedRows = buildMappedRows();
    const res = await axios.post('http://localhost:8080/api/preview', { mappedRows });
    setZpl(res.data.zpl || "");
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
      <div style={{display:'flex', gap:8}}>
        <input type="file" accept=".xlsx" onChange={onFileChange} />
        <button onClick={uploadGeneric}>Upload & Detect Headers</button>
      </div>

      {headers && headers.length > 0 && (
        <div style={{marginTop:12}}>
          <h4>Detected Headers</h4>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {headers.map((h, idx) => <div key={idx} style={{padding:6, border:'1px solid #ddd', borderRadius:4}}>{h}</div>)}
          </div>

          <h4 style={{marginTop:12}}>Field Mapping</h4>
          <table className="table">
            <thead><tr><th>Target Field</th><th>Mapped Column</th></tr></thead>
            <tbody>
              {TARGET_FIELDS.map(tf => (
                <tr key={tf.key}>
                  <td>{tf.label}</td>
                  <td>
                    <select value={mapping[tf.key] || ''} onChange={(e)=>handleMappingChange(tf.key, e.target.value)}>
                      <option value=''>-- none --</option>
                      {headers.map((h, i) => <option key={i} value={h}>{h}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{marginTop:12}}>
            <button onClick={previewServer}>Server Preview (Labelary)</button>
            <input style={{marginLeft:8}} placeholder="Printer IP (for network print)" value={printerIp} onChange={e=>setPrinterIp(e.target.value)} />
            <button style={{marginLeft:8}} onClick={printToNetwork}>Print To Network</button>
          </div>
        </div>
      )}

      {rows && rows.length > 0 && (
        <>
          <h4 style={{marginTop:12}}>Sample Data (first 5 rows)</h4>
          <div style={{overflowX:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(rows[0]).map((h,i)=><th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0,5).map((r, idx) => (
                  <tr key={idx}>
                    {Object.keys(r).map((k,i)=><td key={i}>{r[k]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {preview && (
        <div style={{marginTop:12}}>
          <h4>Server Preview (PNG)</h4>
          <img src={preview} alt="preview" style={{maxWidth:'100%'}} />
        </div>
      )}

      {zpl && (
        <div style={{marginTop:12}}>
          <h4>Generated ZPL (first labels)</h4>
          <pre style={{whiteSpace:'pre-wrap', background:'#111', color:'#0f0', padding:12, borderRadius:6}}>
            {zpl}
          </pre>
        </div>
      )}

    </div>
  );
}
