import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Entry Point da Aplicação React
 * 
 * Renderiza o componente App principal na div#root do index.html
 * Utiliza React 18+ com createRoot para melhor performance
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

