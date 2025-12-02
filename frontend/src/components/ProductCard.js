import React, { useState, useEffect } from 'react';
import { previewProduct, printProduct } from '../api';
import PreviewModal from './PreviewModal';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [printing, setPrinting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [defaultPrinter, setDefaultPrinter] = useState(null);

  // Load default printer from localStorage
  useEffect(() => {
    const printers = JSON.parse(localStorage.getItem('printers') || '[]');
    const def = printers.find(p => p.default);
    setDefaultPrinter(def || null);
  }, []);

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => Math.max(1, prev - 1));

  const onPreview = async () => {
    try {
      const res = await previewProduct(product);
      setPreviewData(res);
      setPreviewOpen(true);
    } catch (e) {
      console.error(e);
      toast.error('Preview failed');
    }
  };

  const onPrint = async (qty) => {
    if (!defaultPrinter) {
      toast.error("No printer configured. Please set a printer in Settings");
      return;
    }

    try {
      setPrinting(true);
      await printProduct(product, defaultPrinter.ip, qty);
      toast.success(`Print sent to ${defaultPrinter.name}: ${qty} labels`);
    } catch (e) {
      console.error(e);
      toast.error('Print failed');
    } finally {
      setPrinting(false);
    }
  };

  const onImageClick = async () => {
    if (!window.confirm(`Print label for ${product.productName}?`)) return;
    await onPrint(quantity);
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: "200px",
          height: "200px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <img
          src={product.productImage_url || '/placeholder.png'}
          alt={product.productName}
          onClick={onImageClick}
          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
        />
      </div>

      <h4>{product.productName}</h4>
      <div className="meta">SKU: {product.sku} · Price: {product.price}</div>
      <div className="meta small">Expiry: {product.expiryDate}</div>

      <div
        className="actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <button className="btn ghost" style={{ width: "30px", height: "30px", padding: 0 }} onClick={decreaseQty}>–</button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: "50px", textAlign: "center", height: "30px", fontSize: "16px" }}
          />
          <button className="btn ghost" style={{ width: "30px", height: "30px", padding: 0 }} onClick={increaseQty}>+</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <button className="btn ghost" onClick={onPreview}>Preview</button>
          <button className="btn primary" onClick={() => onPrint(quantity)} disabled={printing}>
            {printing ? "Printing..." : "Print"}
          </button>
        </div>
      </div>

      {previewOpen && <PreviewModal data={previewData} onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}
