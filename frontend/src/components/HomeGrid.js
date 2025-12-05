import React from 'react';
import ProductCard from './ProductCard';

export default function HomeGrid({ products = [], loading, selectedTemplate, handlePreview }) {
  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
      ) : (
        <div className="grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {products.map(p => (
            <ProductCard
              key={p.id || p.sku}
              product={p}
              selectedTemplate={selectedTemplate}
              handlePreview={handlePreview}
            />
          ))}
        </div>
      )}
    </>
  );
}
