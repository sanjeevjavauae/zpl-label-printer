import UploadExcel from "./components/UploadExcel";
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomeGrid from './components/HomeGrid';
import UploadModal from './components/UploadModal';
import AddProductModal from './components/AddProductModal';
import { ToastContainer, toast } from 'react-toastify';
import { fetchProducts } from './api';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchProducts();
      setProducts(res || []);
    } catch (e) { console.error(e); toast.error('Failed to load products'); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="app">
      <Navbar
        onMenuToggle={() => setMenuOpen(v => !v)}
        onOpenUpload={() => setUploadOpen(true)}
        onOpenAdd={() => setAddOpen(true)}
        menuOpen={menuOpen}
      />
      <main className="main">
        <div className="page-header">
          <h1>Label Printer — Products</h1>
          <div className="subtitle">Click an image to print. Preview before printing for inspections.</div>
        </div>

        <HomeGrid
          products={products}
          onRefresh={load}
          loading={loading}
        />
      </main>

      <UploadModal open={uploadOpen} onClose={() => { setUploadOpen(false); load(); }} />
      <AddProductModal open={addOpen} onClose={() => { setAddOpen(false); load(); }} />

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
