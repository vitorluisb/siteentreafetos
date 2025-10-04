import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import '../styles/Home.css';

// Import do vídeo
import videoClinica from '../assets/clinica/videoclinica.mp4';
import entreafetosLogo from '../assets/logo/entreafetoslogo.png';

const Home = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
    setVideoLoaded(false);
    setVideoError(false);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setVideoLoaded(false);
    setVideoError(false);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    console.log('Video loaded successfully');
  };

  const handleVideoError = (e) => {
    setVideoError(true);
    console.error('Video error:', e);
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
                    src={entreafetosLogo} 
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

      {/* Seção de Estatísticas */}
      <section className="statistics-section">
        <div className="container">
          <div className="statistics-header">
            <h2 className="section-title">Prevalência de Transtornos e Dificuldades de Aprendizagem no Brasil</h2>
            <p className="section-subtitle">
              Conheça os índices que mostram a importância da intervenção psicopedagógica:
            </p>
          </div>
          <div className="statistics-grid">
            <div className="statistic-card">
              <div className="statistic-number">1,2%</div>
              <div className="statistic-title">Autismo</div>
              <div className="statistic-description">1 a cada 36 crianças.</div>
            </div>
            <div className="statistic-card">
              <div className="statistic-number">7,6%</div>
              <div className="statistic-title">TDAH</div>
              <div className="statistic-description">
                em crianças e adolescentes com idade entre 6 e 17 anos.
              </div>
            </div>
            <div className="statistic-card">
              <div className="statistic-number">1,4%</div>
              <div className="statistic-title">Deficiência Intelectual</div>
              <div className="statistic-description">2,6 milhões de brasileiros.</div>
            </div>
            <div className="statistic-card">
              <div className="statistic-number">33,8%</div>
              <div className="statistic-title">Dificuldades</div>
              <div className="statistic-description">
                na aprendizagem das crianças e adolescentes.
              </div>
            </div>
            <div className="statistic-card">
              <div className="statistic-number">10%</div>
              <div className="statistic-title">Transtornos de aprendizagem</div>
              <div className="statistic-description">
                com prejuízos na escrita, leitura e aritmética.
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

      {/* Seção de Convênios */}
      <section className="insurance-section">
        <div className="container">
          <div className="insurance-header">
            <h2 className="section-title">Convênios Aceitos</h2>
            <p className="section-subtitle">
              Trabalhamos com os principais planos de saúde para facilitar o seu atendimento
            </p>
          </div>
          <div className="insurance-logos">
            <div className="insurance-logo-item">
              <img 
                src="/logosPlanoDeSaude/unimed.png" 
                alt="Unimed"
                loading="lazy"
              />
            </div>
            <div className="insurance-logo-item">
              <img 
                src="/logosPlanoDeSaude/Bradesco-Saúde-Logo.png" 
                alt="Bradesco Saúde"
                loading="lazy"
              />
            </div>
            <div className="insurance-logo-item">
              <img 
                src="/logosPlanoDeSaude/logo_SelectSaude.png" 
                alt="Select Saúde"
                loading="lazy"
              />
            </div>
            <div className="insurance-logo-item">
              <img 
                src="/logosPlanoDeSaude/abm-saude.jpg" 
                alt="ABM Saúde"
                loading="lazy"
              />
            </div>
            <div className="insurance-logo-item">
              <img 
                src="/logosPlanoDeSaude/afrafep-saude.png" 
                alt="Afrafep Saúde"
                loading="lazy"
              />
            </div>
            <div className="insurance-logo-item">
              <img 
                src="/logosPlanoDeSaude/camed.png" 
                alt="Camed"
                loading="lazy"
              />
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
              {!videoLoaded && !videoError && (
                <div className="video-loading">
                  <div className="loading-spinner"></div>
                  <p>Carregando vídeo...</p>
                </div>
              )}
              {videoError && (
                <div className="video-error">
                  <p>Erro ao carregar o vídeo.</p>
                  <a href={videoClinica} download className="btn btn-primary">
                    Baixar vídeo
                  </a>
                </div>
              )}
              <video 
                className="modal-video"
                controls
                autoPlay
                muted
                preload="auto"
                playsInline
                webkit-playsinline="true"
                onLoadedData={handleVideoLoad}
                onCanPlay={handleVideoLoad}
                onError={handleVideoError}
                style={{ display: videoLoaded ? 'block' : 'none' }}
                poster=""
                crossOrigin="anonymous"
              >
                <source src={videoClinica} type="video/mp4" />
                <p>Seu navegador não suporta o elemento de vídeo. 
                   <a href={videoClinica} download>Clique aqui para baixar o vídeo</a>
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

