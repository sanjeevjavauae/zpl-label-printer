import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function AddProductModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    sku: '',
    productName: '',
    price: '',
    barcode: '',
    expiryDate: '',
    manufacturedDate: ''
  });

  const [image, setImage] = useState(null);

  if (!open) return null;

  const submit = async () => {
    if (!form.sku || !form.productName) {
      return toast.error("SKU and Product Name are required");
    }

    const newProduct = { ...form, image };

    // Pass the product back to parent component
    if (onAdd) onAdd(newProduct);

    toast.success("Product added (local only)");
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h3>Add Product</h3>

        <div className="form-row">
          <input
            className="input"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </div>

        <div className="form-row">
          <input
            className="input"
            placeholder="Product Name"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
          />
        </div>

        <div className="form-row">
          <input
            className="input"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div className="form-row">
          <input
            className="input"
            placeholder="Barcode"
            value={form.barcode}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
          />
        </div>

        <div className="form-row">
          <input
            className="input"
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />
        </div>

        <div className="form-row">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={submit}>Add</button>
        </div>
      </div>
    </div>
  );
}
