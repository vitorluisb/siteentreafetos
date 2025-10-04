import React from 'react';
import { motion } from 'framer-motion';
import '../styles/AboutSubpages.css';

const AboutHistory = () => {
  const clinicImages = [
    {
      id: 1,
      src: '/clinica/clinicajua.JPG',
      alt: 'Unidade Juá da Clínica Entre Afetos',
      title: 'Unidade Juá'
    },
    {
      id: 2,
      src: '/clinica/clinicamanoel.JPG',
      alt: 'Unidade Manoel Meireles da Clínica Entre Afetos',
      title: 'Unidade Manoel Aquarela'
    },
    {
      id: 3,
      src: '/clinica/clinicasolanea.png',
      alt: 'Unidade Solânea da Clínica Entre Afetos',
      title: 'Unidade Solânea'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="about-subpage">
      <section className="sub-hero">
        <div className="container">
          <h1>Nossa História</h1>
          <p className="intro">Uma trajetória construída com amor, ciência e dedicação.</p>
        </div>
      </section>
      
      <section className="sub-content">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Como tudo começou</h2>
              <p>
                A Entre Afetos surgiu do sonho de três profissionais da cidade de Guarabira/PB 
                que se conheceram participando de cursos de capacitação na área de 
                desenvolvimento infantil. O desejo era fornecer um serviço de qualidade e 
                atualizado cientificamente e, o principal, acolher famílias.
              </p>
              <p>
                Inauguramos, em 2019, o nosso espaço que contava apenas com uma sala 
                para cada profissional. Em 2020, fizemos a nossa primeira mudança e em 2021, 
                a segunda, com o objetivo de expandir a nossa estrutura física e os serviços e 
                especialidades oferecidos.
              </p>
              <p>
                Em 2022, mais um sonho tomou forma: instalamos a segunda unidade na nossa cidade. 
                Agora, em 2023, estamos acolhendo e cuidando de ainda mais famílias, com a 
                implantação da nossa terceira unidade na cidade de Solânea/PB.
              </p>
            </div>
            <div className="story-image">
              <div className="video-container">
                <iframe
                  src="https://www.youtube.com/embed/Z3M4ArrpQnQ"
                  title="Vídeo da Clínica Entre Afetos"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="story-video"
                />
              </div>
            </div>
          </div>

          <motion.div 
            className="clinic-gallery"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>Nossas Unidades</h2>
            <div className="gallery-grid">
              {clinicImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="gallery-item"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={image.src} alt={image.alt} />
                  <div className="gallery-overlay">
                    <h3>{image.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="purpose-section">
            <div className="purpose-card featured">
              <div className="purpose-icon">💝</div>
              <h3>Por que Entre Afetos?</h3>
              <p>Além do conhecimento técnico, entendemos que acolher crianças e famílias com afeto é o caminho para alcançarmos o melhor desenvolvimento das nossas crianças.</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h3>Nosso Propósito</h3>
              <p>Contribuir para o desenvolvimento infantil acolhendo famílias, unindo ciência, responsabilidade e afeto.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🤝</div>
              <h3>Como atuamos</h3>
              <p>Atuamos estimulando o desenvolvimento de crianças e adolescentes que apresentam atrasos ou deficiências, assim como, na intervenção precoce.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">👶</div>
              <h3>Nosso Público</h3>
              <p>Crianças e adolescentes com atraso em qualquer área do desenvolvimento ou diagnosticadas com transtornos do desenvolvimento, síndromes ou deficiências.</p>
            </div>
          </div>

          <div className="services-section">
            <h2>Serviços oferecidos</h2>
            <div className="services-list">
              <div className="service-item">
                <span className="service-bullet">✓</span>
                <span>Avaliação do desenvolvimento infantil</span>
              </div>
              <div className="service-item">
                <span className="service-bullet">✓</span>
                <span>Terapia multidisciplinar individual ou em grupo</span>
              </div>
              <div className="service-item">
                <span className="service-bullet">✓</span>
                <span>Visita escolar</span>
              </div>
              <div className="service-item">
                <span className="service-bullet">✓</span>
                <span>Orientação/Consultoria escolar</span>
              </div>
              <div className="service-item">
                <span className="service-bullet">✓</span>
                <span>Orientação/Consultoria parental</span>
              </div>
              <div className="service-item">
                <span className="service-bullet">✓</span>
                <span>Cursos</span>
              </div>
              <div className="service-item">
                <span className="service-bullet">✓</span>
                <span>Capacitações</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutHistory;


