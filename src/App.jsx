import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import BusinessCardPage from './pages/BusinessCard';
import './App.css';

/**
 * App Component - Componente raiz da aplicação
 * 
 * Gerencia todas as rotas da aplicação e define quais páginas
 * utilizam o layout completo e quais são independentes.
 * 
 * Rotas:
 * - /cartao: Cartão digital independente (sem layout)
 * - Demais rotas: Páginas com layout completo (nav + footer + chatbot)
 * 
 * @returns {JSX.Element} Aplicação completa com roteamento
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota independente para cartão digital */}
          <Route path="/cartao" element={<BusinessCardPage />} />
          
          {/* Rotas principais com layout completo */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/sobre" element={<Layout><About /></Layout>} />
          <Route path="/servicos" element={<Layout><Services /></Layout>} />
          <Route path="/contato" element={<Layout><Contact /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
