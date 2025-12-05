import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomeGrid from './components/HomeGrid';
import UploadModal from './components/UploadModal';
import AddProductModal from './components/AddProductModal';
import PreviewModal from './components/PreviewModal';
import TemplateModal from './components/TemplateModal';
import { ToastContainer, toast } from 'react-toastify';
import { fetchProducts, previewProduct } from './api';
import { labelTemplates } from './config/labelTemplates';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previewData, setPreviewData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(labelTemplates[0]); // default 3x2

  async function load() {
    setLoading(true);
    try {
      const res = await fetchProducts();
      setProducts(res || []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load products');
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handlePreview = async (product) => {
    if (!selectedTemplate) {
      toast.error("Please select a label template first");
      return;
    }
    try {
      const res = await previewProduct(product, selectedTemplate);
      setPreviewData(res);
      setPreviewOpen(true);
    } catch (e) {
      console.error(e);
      toast.error("Preview failed");
    }
  };

  return (
    <div className="app">
      <Navbar
        onMenuToggle={() => setMenuOpen(v => !v)}
        onOpenUpload={() => setUploadOpen(true)}
        onOpenAdd={() => setAddOpen(true)}
        menuOpen={menuOpen}
        openTemplateModal={() => setTemplateModalOpen(true)}
      />

      <main className="main">
        <div className="page-header">
          <h1>Label Printer — Products</h1>
          <div className="subtitle">
            Click an image to print. Preview before printing for inspections.
          </div>
        </div>

        <HomeGrid
          products={products}
          onRefresh={load}
          loading={loading}
          selectedTemplate={selectedTemplate}
          handlePreview={handlePreview}
        />
      </main>

      <UploadModal open={uploadOpen} onClose={() => { setUploadOpen(false); load(); }} />
      <AddProductModal open={addOpen} onClose={() => { setAddOpen(false); load(); }} />

      {previewOpen && (
        <PreviewModal
          data={previewData}
          onClose={() => setPreviewOpen(false)}
          selectedTemplate={selectedTemplate}
        />
      )}

      {templateModalOpen && (
        <TemplateModal
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          onClose={() => setTemplateModalOpen(false)}
        />
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}
