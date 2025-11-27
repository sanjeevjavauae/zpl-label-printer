import React from 'react';
import { FiMenu } from 'react-icons/fi';

export default function Navbar({ onMenuToggle, onOpenUpload, onOpenAdd, menuOpen }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">LP</div>
        <div>
          <div style={{fontWeight:700}}>Label Printer</div>
          <div style={{fontSize:12,color:'#888'}}>Excel → ZPL → Print</div>
        </div>
      </div>

      <div style={{position:'relative'}}>
        <div className="hamburger" onClick={onMenuToggle}><FiMenu size={20} /></div>
        {menuOpen && (
          <div className="menu">
            <button onClick={onOpenUpload}>Upload products (Excel + images)</button>
            <button onClick={onOpenAdd}>Add single product</button>
            <button onClick={()=>alert('Printer settings not implemented yet')}>Printers / Settings</button>
            <button onClick={()=>alert('Print history not implemented')}>Print history</button>
          </div>
        )}
      </div>
    </header>
  );
}
