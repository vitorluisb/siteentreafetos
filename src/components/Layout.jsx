import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import Chatbot from './Chatbot';

/**
 * Layout Component - Componente de layout principal do site
 * 
 * Responsável por renderizar a estrutura comum (Navigation, Footer, Chatbot)
 * em torno do conteúdo principal das páginas.
 * 
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Conteúdo da página a ser renderizado
 * @returns {JSX.Element} Layout completo com navegação, conteúdo e rodapé
 */
const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default Layout;
