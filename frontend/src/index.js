import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
createRoot(container).render(<App />);
