import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import PrinterSettings from './PrinterSettings';

export default function Navbar({ onMenuToggle, onOpenUpload, onOpenAdd, menuOpen, openTemplateModal }) {
  const [printerModalOpen, setPrinterModalOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">LP</div>
        <div>
          <div style={{ fontWeight: 700 }}>Label Printer</div>
          <div style={{ fontSize: 12, color: '#888' }}>Excel → ZPL → Print</div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="hamburger" onClick={onMenuToggle}>
          <FiMenu size={20} />
        </div>
        {menuOpen && (
          <div className="menu">
            <button onClick={() => { onOpenUpload(); onMenuToggle(); }}>Upload products</button>
            <button onClick={() => { onOpenAdd(); onMenuToggle(); }}>Add single product</button>
            <button onClick={() => { openTemplateModal(); onMenuToggle(); }}>Select Label Template</button>
            <button onClick={() => { setPrinterModalOpen(true); onMenuToggle(); }}>Printers / Settings</button>
          </div>
        )}
      </div>

      {printerModalOpen && <PrinterSettings onClose={() => setPrinterModalOpen(false)} />}
    </header>
  );
}
