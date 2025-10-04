import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import '../styles/ButtonsSection.css';

const ButtonsSection = () => {
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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 }
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
    <section className="buttons-section">
      <div className="container">
        <motion.div
          className="buttons-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg buttons-btn-primary"
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
            className="btn btn-secondary btn-lg buttons-btn-secondary"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span>Conhecer Mais</span>
            <FaArrowRight />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ButtonsSection;