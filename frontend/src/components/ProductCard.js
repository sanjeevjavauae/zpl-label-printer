import React, { useState, useEffect } from 'react';
import { printToNetwork } from '../api';
import { toast } from 'react-toastify';

export default function ProductCard({ product, selectedTemplate, handlePreview }) {
  const [quantity, setQuantity] = useState(1);
  const [defaultPrinter, setDefaultPrinter] = useState(null);

  useEffect(() => {
    const printers = JSON.parse(localStorage.getItem('printers') || '[]');
    const def = printers.find(p => p.default);
    setDefaultPrinter(def || null);
  }, []);

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => Math.max(1, prev - 1));

  const onImageClick = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a label template first");
      return;
    }
    if (!defaultPrinter) {
      toast.error("No printer configured. Please set a printer in Settings");
      return;
    }

    try {
      let printerIp = "";
      if (typeof defaultPrinter.ip === "string") {
        printerIp = defaultPrinter.ip;
      } else if (defaultPrinter.ip && typeof defaultPrinter.ip === "object") {
        printerIp = defaultPrinter.ip.ip || "";
      }

      if (!printerIp) {
        toast.error("Printer IP is invalid");
        return;
      }

      await printToNetwork(product, selectedTemplate, printerIp, quantity);
      toast.success(`Print sent to ${defaultPrinter.name}: ${quantity} labels`);
    } catch (e) {
      console.error(e);
      toast.error("Print failed");
    }
  };

  return (
    <div className="card" style={{ width: '200px', textAlign: 'center' }}>
      <div
        style={{
          width: "200px",
          height: "200px",
          marginBottom: "10px",
          overflow: "hidden",        // IMPORTANT
          background: "#fff",
          borderRadius: "4px"
        }}
      >
        <img
          src={product.productImage_url || '/placeholder.png'}
          alt={product.productName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",     // COVER again = full-size images
            cursor: "pointer",
            display: "block",
          }}
          onClick={onImageClick}
        />
      </div>

      <h4>{product.productName}</h4>
      <div className="meta">SKU: {product.sku} · Price: {product.price}</div>
      <div className="meta small">Expiry: {product.expiryDate}</div>

      <div className="actions" style={{ marginTop: '8px' }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
          <button className="btn ghost" onClick={decreaseQty}>–</button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{ width: '50px', textAlign: 'center' }}
          />
          <button className="btn ghost" onClick={increaseQty}>+</button>
        </div>

        <div style={{ marginTop: '6px' }}>
          <button
            className="btn ghost"
            onClick={() => handlePreview(product)}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}
