import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import BusinessCardPage from './pages/BusinessCard';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/cartao" element={<BusinessCardPage />} />
        <Route path="/*" element={
          <>
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/contato" element={<Contact />} />
            </Routes>
            <Footer />
            <Chatbot />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
