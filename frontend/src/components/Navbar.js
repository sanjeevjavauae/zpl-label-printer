import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import PrinterSettings from './PrinterSettings'; // Ensure this path is correct

export default function Navbar({ onMenuToggle, onOpenUpload, onOpenAdd, menuOpen }) {
  const [printerModalOpen, setPrinterModalOpen] = useState(false);

  // Wrappers to close menu after action
  const handleOpenUpload = () => {
    onOpenUpload();
    onMenuToggle(); // close hamburger menu
  };

  const handleOpenAdd = () => {
    onOpenAdd();
    onMenuToggle(); // close hamburger menu
  };

  const handleOpenPrinterSettings = () => {
    setPrinterModalOpen(true);
    onMenuToggle(); // close hamburger menu
  };

  const handlePrintHistory = () => {
    alert('Print history not implemented');
    onMenuToggle(); // close hamburger menu
  };

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
            <button onClick={handleOpenUpload}>Upload products (Excel + images)</button>
            <button onClick={handleOpenAdd}>Add single product</button>
            <button onClick={handleOpenPrinterSettings}>Printers / Settings</button>
            <button onClick={handlePrintHistory}>Print history</button>
          </div>
        )}
      </div>

      {/* Printer Settings Modal */}
      {printerModalOpen && (
        <PrinterSettings onClose={() => setPrinterModalOpen(false)} />
      )}
    </header>
  );
}
