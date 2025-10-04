import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import '../styles/About.css';

// Import das imagens da clínica
import clinicaSolaneaImg from '../assets/clinica/clinicasolanea.png';
import clinicaRecImg from '../assets/clinica/clinicarec.png';
import clinicaSalaImg from '../assets/clinica/clinicsala.png';

// Import das imagens da equipe
import membroImg from '../assets/equipe/membro.png';
import membro1Img from '../assets/equipe/membro1.png';
import membro2Img from '../assets/equipe/membro2.png';

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para controlar flip por membro (universal para todos dispositivos)
  const [flippedMembers, setFlippedMembers] = useState({});
  // Estado para detectar se é hover ou click/touch
  const [hoverStates, setHoverStates] = useState({});

  /**
   * Handler universal para alternar o flip do card
   * Funciona tanto para click/touch quanto para toggle manual
   */
  const handleCardToggle = (memberId) => {
    setFlippedMembers((prev) => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  /**
   * Handler para mouse enter - apenas para desktop com hover
   */
  const handleMouseEnter = (memberId) => {
    // Só ativa hover se o card não estiver manualmente flipped
    if (!flippedMembers[memberId]) {
      setHoverStates((prev) => ({
        ...prev,
        [memberId]: true
      }));
    }
  };

  /**
   * Handler para mouse leave - apenas para desktop com hover
   */
  const handleMouseLeave = (memberId) => {
    setHoverStates((prev) => ({
      ...prev,
      [memberId]: false
    }));
  };

  /**
   * Determina se o card deve estar flipped baseado no estado manual ou hover
   */
  const isCardFlipped = (memberId) => {
    return flippedMembers[memberId] || hoverStates[memberId];
  };
  const clinicImages = [
    {
      id: 1,
      src: clinicaSolaneaImg,
      alt: 'Clínica Solânea',
      title: 'Clínica Solânea'
    },
    {
      id: 2,
      src: clinicaRecImg,
      alt: 'Sala de Espera',
      title: 'Sala de Espera'
    },
    {
      id: 3,
      src: clinicaSalaImg,
      alt: 'Sala de Atendimento',
      title: 'Sala de Atendimento'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === clinicImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? clinicImages.length - 1 : prevIndex - 1
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const teamMembers = [
    {
      id: 1,
      name: 'Dra. Ana Maria Silva',
      specialty: 'Psicóloga Clínica',
      registration: 'CRP 12/12345',
      bio: 'Especialista em psicologia infantil com mais de 10 anos de experiência. Formada pela UFPB, com especialização em terapia cognitivo-comportamental.',
      photo: membroImg
    },
    {
      id: 2,
      name: 'Dra. Patrícia Lima',
      specialty: 'Terapeuta Familiar',
      registration: 'CRP 12/12346',
      bio: 'Especialista em terapia familiar sistêmica. Formada pela UFPB com especialização em terapia de casal e família.',
      photo: membro1Img
    },
    {
      id: 3,
      name: 'Dra. Carla Santos',
      specialty: 'Nutricionista',
      registration: 'CRN 12/12347',
      bio: 'Especialista em nutrição infantil e adolescente. Formada pela UFPB com especialização em transtornos alimentares.',
      photo: membro2Img
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            className="about-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Sobre a Clínica Entre Afetos</h1>
            <p>
              Há mais de 15 anos cuidando com carinho e profissionalismo 
              do desenvolvimento emocional de crianças e adolescentes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Link rápido para a História */}
      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Nossa História</h2>
              <p>Conheça nossa trajetória detalhada, missão, visão e valores.</p>
              <a href="/sobre/historia" className="btn btn-primary">Ver História completa</a>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="about-values">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Nossos Valores
          </motion.h2>
          <motion.div
            className="values-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="value-card" variants={itemVariants}>
              <div className="value-icon">🎯</div>
              <h3>Missão</h3>
              <p>
                Promover o desenvolvimento emocional saudável de crianças e adolescentes, 
                oferecendo cuidado especializado e acolhedor em um ambiente seguro e confortável.
              </p>
            </motion.div>
            <motion.div className="value-card" variants={itemVariants}>
              <div className="value-icon">👁️</div>
              <h3>Visão</h3>
              <p>
                Ser referência em psicologia infanto-juvenil na Paraíba, reconhecida 
                pela excelência no atendimento e pelo impacto positivo na vida das famílias.
              </p>
            </motion.div>
            <motion.div className="value-card" variants={itemVariants}>
              <div className="value-icon">💎</div>
              <h3>Valores</h3>
              <p>
                Ética, respeito, empatia, profissionalismo e compromisso com o 
                desenvolvimento integral de cada paciente e sua família.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Equipe */}
      <section className="about-team">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Nossa Equipe
          </motion.h2>
          <motion.div
            className="team-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                className={`team-card ${isCardFlipped(member.id) ? 'flipped' : ''}`}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                // Handlers universais para click/touch - funcionam em todos dispositivos
                onClick={(e) => {
                  e.preventDefault();
                  handleCardToggle(member.id);
                }}
                // Handlers para hover em desktop - não interferem com touch
                onMouseEnter={() => handleMouseEnter(member.id)}
                onMouseLeave={() => handleMouseLeave(member.id)}
                // Acessibilidade - permite navegação por teclado
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardToggle(member.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Ver mais informações sobre ${member.name}`}
                aria-pressed={isCardFlipped(member.id)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <div className="member-photo">
                      <img src={member.photo} alt={member.name} className="photo-image" />
                    </div>
                    <h3>{member.name}</h3>
                    <p className="specialty">{member.specialty}</p>
                    <div className="flip-hint">
                      <span>Clique ou passe o mouse para saber mais</span>
                    </div>
                  </div>
                  <div className="card-back">
                    <h3>{member.name}</h3>
                    <p className="specialty">{member.specialty}</p>
                    <p className="registration">{member.registration}</p>
                    <p className="bio">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="about-stats">
        <div className="container">
          <motion.div
            className="stats-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="stat-item" variants={itemVariants}>
              <div className="stat-number">500+</div>
              <div className="stat-label">Famílias Atendidas</div>
            </motion.div>
            <motion.div className="stat-item" variants={itemVariants}>
              <div className="stat-number">15+</div>
              <div className="stat-label">Anos de Experiência</div>
            </motion.div>
            <motion.div className="stat-item" variants={itemVariants}>
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfação dos Pacientes</div>
            </motion.div>
            <motion.div className="stat-item" variants={itemVariants}>
              <div className="stat-number">4</div>
              <div className="stat-label">Profissionais Especializados</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Imagem */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="image-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="image-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Fechar modal"
              >
                <FaTimes />
              </button>
              
              <div className="modal-image-container">
                <img
                  src={clinicImages[currentImageIndex].src}
                  alt={clinicImages[currentImageIndex].alt}
                  className="modal-image"
                />
              </div>
              
              <div className="modal-controls">
                <button 
                  className="modal-nav-btn prev-btn"
                  onClick={prevImage}
                  aria-label="Imagem anterior"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="modal-nav-btn next-btn"
                  onClick={nextImage}
                  aria-label="Próxima imagem"
                >
                  <FaChevronRight />
                </button>
              </div>
              
              <div className="modal-title">
                <h3>{clinicImages[currentImageIndex].title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;

