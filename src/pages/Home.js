import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import '../styles/Home.css';

const Home = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  return (
    <div className="home-page">
      <HeroSection />
      
      {/* Seção de Destaque */}
      <section className="highlight-section">
        <div className="container">
          <div className="highlight-content">
            <div className="highlight-text">
              <h2>Por que escolher a Clínica Entre Afetos?</h2>
              <p>
                Nossa clínica é especializada no cuidado emocional de crianças e adolescentes, 
                oferecendo um ambiente acolhedor e profissionais qualificados para acompanhar 
                cada etapa do desenvolvimento.
              </p>
              <div className="highlight-features">
                <div className="feature-item">
                  <div className="feature-icon">🏥</div>
                  <div className="feature-text">
                    <h4>Ambiente Acolhedor</h4>
                    <p>Espaços pensados para o conforto e segurança</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👩‍⚕️</div>
                  <div className="feature-text">
                    <h4>Profissionais Qualificados</h4>
                    <p>Equipe especializada em psicologia infanto-juvenil</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💝</div>
                  <div className="feature-text">
                    <h4>Cuidado Personalizado</h4>
                    <p>Atendimento individualizado para cada paciente</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="highlight-video">
              <div className="video-thumbnail" onClick={openVideoModal}>
                <div className="video-poster">
                  <img 
                    src="/logo/entreafetoslogo.png" 
                    alt="Clínica Entre Afetos" 
                    className="poster-image"
                  />
                  <div className="play-overlay">
                    <div className="play-button">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="video-info">
                  <h4>Conheça Nossa Clínica</h4>
                  <p>Clique para assistir ao vídeo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">O que nossos pacientes dizem</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "A Clínica Entre Afetos transformou a vida do nosso filho. 
                  O cuidado e profissionalismo da equipe são excepcionais."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Maria Silva</h4>
                  <span>Mãe do João, 8 anos</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "Encontramos na clínica um ambiente seguro e acolhedor. 
                  A evolução da nossa filha foi notável em poucos meses."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Carlos Santos</h4>
                  <span>Pai da Ana, 12 anos</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "Profissionais dedicados e ambiente que transmite confiança. 
                  Recomendo de olhos fechados!"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Patrícia Lima</h4>
                  <span>Mãe do Pedro, 15 anos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para cuidar do desenvolvimento emocional do seu filho?</h2>
            <p>
              Entre em contato conosco e agende uma consulta. 
              Estamos aqui para ajudar sua família a crescer junta.
            </p>
            <div className="cta-buttons">
              <a 
                href="https://wa.me/5583986102718?text=Olá! Gostaria de agendar uma consulta na Clínica Entre Afetos."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                Agendar Consulta
              </a>
              <a 
                href="/contato"
                className="btn btn-secondary btn-lg"
              >
                Falar Conosco
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal do Vídeo */}
      {isVideoModalOpen && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeVideoModal}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className="video-container">
              <video 
                className="modal-video"
                controls
                autoPlay
                preload="metadata"
                playsInline
                webkit-playsinline="true"
              >
                <source src="/clinica/videoclinica.mp4" type="video/mp4" />
                <p>Seu navegador não suporta o elemento de vídeo. 
                   <a href="/clinica/videoclinica.mp4" download>Clique aqui para baixar o vídeo</a>
                </p>
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

