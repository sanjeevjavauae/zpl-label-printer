import React from 'react';
import ProductCard from './ProductCard';

export default function HomeGrid({ products = [], onRefresh, loading }) {
  return (
    <>
      {loading ? <div style={{textAlign:'center',padding:40}}>Loading...</div> :
        <div className="grid" style={{marginTop:12}}>
          {products.map(p => <ProductCard key={p.id || p.sku} product={p} />)}
        </div>
      }
    </>
  );
}
