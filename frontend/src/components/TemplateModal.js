import React from 'react';
import { labelTemplates } from '../config/labelTemplates';

export default function TemplateModal({ onClose, selectedTemplate, setSelectedTemplate }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ width: 400, padding: 20 }}>
        <h3>Select Label Template</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginTop: 10
        }}>
          {labelTemplates.map(t => (
            <button
              key={t.id}
              style={{
                padding: 10,
                background: selectedTemplate?.id === t.id ? '#1890ff' : '#f0f0f0',
                color: selectedTemplate?.id === t.id ? '#fff' : '#000',
                border: '1px solid #ccc',
                borderRadius: 6,
                cursor: 'pointer'
              }}
              onClick={() => setSelectedTemplate(t)}
            >
              {t.name}
            </button>
          ))}
        </div>

        <button style={{ marginTop: 20 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
