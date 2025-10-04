import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaUsers } from 'react-icons/fa';
import '../styles/HeroSection.css';

const HeroSection = () => {
  // Array com os banners disponíveis
  const banners = [
    '/bannerhero/banneradaptado.png',
    '/bannerhero/bannerautismo.png',
    '/bannerhero/bannerpisc.png',
    '/bannerhero/bannertdah.png',
    '/bannerhero/outubrorosa1.png'
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  // Carrossel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [banners.length]);

  // Função para avançar manualmente (hover/click)
  const nextSlide = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const whatsappNumber = '5583986102718';
  const whatsappMessage = 'Olá! Gostaria de agendar uma consulta na Clínica Entre Afetos.';

  return (
    <section className="hero-section">
      {/* Container responsivo apenas para mobile */}
      <div className="hero-mobile-container p-4 sm:p-6 md:p-0">
        {banners.map((banner, index) => (
          <motion.div
            key={index}
            className={`carousel-slide-mobile ${index === currentBanner ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${banner})`,
              '--hero-bg': `url(${banner})`
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentBanner ? 1 : 0,
              scale: index === currentBanner ? 1 : 1.1
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Imagens diretas para desktop - SEM container */}
      {banners.map((banner, index) => (
        <motion.div
          key={`desktop-${index}`}
          className={`carousel-slide-desktop ${index === currentBanner ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${banner})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentBanner ? 1 : 0,
            scale: index === currentBanner ? 1 : 1.1
          }}
          transition={{ 
            duration: 1,
            ease: "easeInOut"
          }}
          onClick={nextSlide}
          whileHover={{ 
            scale: index === currentBanner ? 1.03 : 1.02,
            transition: { duration: 0.3 }
          }}
        />
      ))}

      {/* Overlay com conteúdo */}
      <div className="hero-overlay">
        <div className="hero-content">
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWhatsapp />
              <span>Agendar Consulta</span>
            </motion.a>

            <motion.a
              href="#sobre"
              className="hero-btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUsers />
              <span>Conheça Nossa Equipe</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;