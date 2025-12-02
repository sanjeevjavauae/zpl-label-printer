import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function PrinterSettings({ onClose }) {
  const [printers, setPrinters] = useState([]);
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('printers') || '[]');
    setPrinters(saved);
  }, []);

  const addPrinter = () => {
    if (!name.trim() || !ip.trim()) {
      toast.error("Printer name and IP are required");
      return;
    }
    const newPrinter = {
      name: name.trim(),
      ip: ip.trim(),
      default: printers.length === 0
    };
    setPrinters([...printers, newPrinter]);
    setName('');
    setIp('');
    toast.success("Printer added");
  };

  const removePrinter = (index) => {
    const updated = printers.filter((_, i) => i !== index);
    if (!updated.some(p => p.default) && updated.length > 0) {
      updated[0].default = true;
    }
    setPrinters(updated);
    localStorage.setItem("printers", JSON.stringify(updated));
    toast.success("Printer removed");
  };

  const setDefaultPrinter = (index) => {
    const updated = printers.map((p, i) => ({ ...p, default: i === index }));
    setPrinters(updated);
    localStorage.setItem("printers", JSON.stringify(updated));
    toast.success("Default printer changed");
  };

  const savePrinters = () => {
    if (printers.length === 0) {
      toast.error("Add at least one printer");
      return;
    }
    localStorage.setItem("printers", JSON.stringify(printers));
    toast.success("Printer settings saved");
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.header}>Printer Settings</h2>

        {/* Printer list */}
        <div>
          {printers.length === 0 && <div style={styles.emptyText}>No printers added.</div>}
          {printers.map((p, i) => (
            <div key={i} style={styles.printerRow}>
              <div>
                <strong>{p.name}</strong> ({p.ip}) {p.default && <span style={styles.defaultBadge}>Default</span>}
              </div>
              <div style={styles.rowButtons}>
                {!p.default && <button style={styles.setDefaultBtn} onClick={() => setDefaultPrinter(i)}>Set Default</button>}
                <button style={styles.removeBtn} onClick={() => removePrinter(i)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add printer */}
        <div style={styles.addContainer}>
          <input
            type="text"
            placeholder="Printer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Printer IP"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            style={styles.input}
          />
          <button style={styles.addBtn} onClick={addPrinter}>Add</button>
        </div>

        {/* Action buttons */}
        <div style={styles.actionButtons}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.saveBtn} onClick={savePrinters}>Save</button>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 50,
    zIndex: 2000
  },
  modal: {
    background: '#fff',
    padding: 25,
    borderRadius: 12,
    width: 600, // increased width
    boxSizing: 'border-box',
    boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
    overflow: 'visible'
  },
  header: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 600,
    color: '#333'
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10
  },
  printerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 8,
    marginBottom: 10,
    background: '#fafafa'
  },
  defaultBadge: {
    color: '#fff',
    background: '#28a745',
    padding: '2px 6px',
    borderRadius: 6,
    fontSize: 12,
    marginLeft: 6
  },
  rowButtons: {
    display: 'flex',
    gap: 8
  },
  setDefaultBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#1890ff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    minWidth: 100,
    textAlign: 'center'
  },
  removeBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#ff4d4f',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    minWidth: 100,
    textAlign: 'center'
  },
  addContainer: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #ccc',
    minWidth: 0 // allows flex shrink
  },
  addBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#1890ff',
    color: '#fff',
    fontWeight: 500,
    cursor: 'pointer',
    minWidth: 100,
    textAlign: 'center'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: '1px solid #ccc',
    background: '#f0f0f0',
    color: '#333',
    cursor: 'pointer',
    fontWeight: 500,
    minWidth: 100,
    textAlign: 'center'
  },
  saveBtn: {
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    minWidth: 100,
    textAlign: 'center'
  }
};
