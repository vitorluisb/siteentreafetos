import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import '../styles/HeroSection.css';

const HeroSection = () => {
  const whatsappNumber = '5583986102718';
  const whatsappMessage = 'Olá! Gostaria de agendar uma consulta na Clínica Entre Afetos.';

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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.8 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Ícone decorativo */}
          <motion.div
            className="hero-icon"
            variants={itemVariants}
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaHeart />
          </motion.div>

          {/* Título principal */}
          <motion.h1
            className="hero-title"
            variants={itemVariants}
          >
            Construindo Afetos,
            <br />
            <span className="highlight">Promovendo Saúde Emocional</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="hero-subtitle"
            variants={itemVariants}
          >
            Cuidamos com carinho e profissionalismo do desenvolvimento emocional 
            de crianças e adolescentes, criando um ambiente seguro e acolhedor 
            para o crescimento saudável.
          </motion.p>

          {/* Botões de ação */}
          <motion.div
            className="hero-buttons"
            variants={itemVariants}
          >
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg hero-btn-primary"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaWhatsapp />
              <span>Agendar Consulta</span>
              <FaArrowRight />
            </motion.a>

            <motion.a
              href="#sobre"
              className="btn btn-secondary btn-lg hero-btn-secondary"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span>Conhecer Mais</span>
              <FaArrowRight />
            </motion.a>
          </motion.div>

          {/* Estatísticas */}
          <motion.div
            className="hero-stats"
            variants={itemVariants}
          >
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Famílias Atendidas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Anos de Experiência</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfação dos Pacientes</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Ilustração */}
        <motion.div
          className="hero-illustration"
          variants={itemVariants}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="illustration-container">
            <div className="illustration-circle illustration-circle-1"></div>
            <div className="illustration-circle illustration-circle-2"></div>
            <div className="illustration-circle illustration-circle-3"></div>
            <div className="illustration-heart">
              <FaHeart />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <div className="floating-elements">
        <motion.div
          className="floating-element floating-element-1"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaHeart />
        </motion.div>
        <motion.div
          className="floating-element floating-element-2"
          animate={{
            y: [0, -15, 0],
            x: [0, -8, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <FaHeart />
        </motion.div>
        <motion.div
          className="floating-element floating-element-3"
          animate={{
            y: [0, -25, 0],
            x: [0, 12, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <FaHeart />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

