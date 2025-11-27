import React, { useState } from 'react';
import { previewProduct, printProduct } from '../api';
import PreviewModal from './PreviewModal';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [printing, setPrinting] = useState(false);

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

  const onPrint = async () => {
    const ip = prompt('Enter Printer IP (or leave blank for default):');
    if (!ip) return;
    try {
      setPrinting(true);
      await printProduct(product, ip);
      toast.success('Print sent');
    } catch (e) {
      console.error(e);
      toast.error('Print failed');
    } finally { setPrinting(false); }
  };

  const onImageClick = async () => {
    if (!window.confirm(`Print label for ${product.productName}?`)) return;
    await onPrint();
  };

  return (
    <div className="card">
      <img src={product.productImage_url || '/placeholder.png'} alt={product.productName} onClick={onImageClick} />
      <h4>{product.productName}</h4>
      <div className="meta">SKU: {product.sku} · Price: {product.price}</div>
      <div className="meta small">Expiry: {product.expiryDate}</div>
      <div className="actions">
        <button className="btn ghost" onClick={onPreview}>Preview</button>
        <button className="btn primary" onClick={onPrint} disabled={printing}>{printing ? 'Printing...' : 'Print'}</button>
      </div>

      {previewOpen && <PreviewModal data={previewData} onClose={()=>setPreviewOpen(false)} />}
    </div>
  );
}
