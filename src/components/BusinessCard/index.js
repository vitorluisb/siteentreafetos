import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebook, 
  FaQrcode,
  FaSun,
  FaMoon,
  FaTimes,
  FaExternalLinkAlt,
  FaGlobe
} from 'react-icons/fa';
import './BusinessCard.css';

const BusinessCard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const locations = [
    {
      id: 1,
      name: "Clínica Entre Afetos - Guarabira Centro",
      address: "Manoel Lordão, 219 - Centro, Guarabira - PB",
      phone: "(83) 98610-2718",
      hours: "Seg-Sex: 8h às 18h",
      position: { lat: -6.8578, lng: -35.4900 },
      mapUrl: "https://maps.google.com/?q=Manoel+Lordao+219+Centro+Guarabira+PB"
    },
    {
      id: 2,
      name: "Clínica Entre Afetos - Guarabira",
      address: "José Bonifácio, 15 - Centro, Guarabira - PB",
      phone: "(83) 98610-2718",
      hours: "Seg-Sex: 8h às 18h",
      position: { lat: -6.8578, lng: -35.4900 },
      mapUrl: "https://maps.google.com/?q=Jose+Bonifacio+15+Centro+Guarabira+PB"
    },
    {
      id: 3,
      name: "Clínica Entre Afetos - Solânea",
      address: "Rua Cirilo da Costa Maranhão, 284 - Centro, Solânea - PB",
      phone: "(83) 98610-2718",
      hours: "Seg-Sex: 8h às 18h",
      position: { lat: -6.7558, lng: -35.6647 },
      mapUrl: "https://maps.google.com/?q=Rua+Cirilo+da+Costa+Maranhao+284+Centro+Solanea+PB"
    }
  ];

  const socialLinks = [
    { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', url: 'https://wa.me/5583986102718' },
    { name: 'Instagram', icon: FaInstagram, color: '#E4405F', url: 'https://instagram.com/entreafetos' },
    { name: 'Facebook', icon: FaFacebook, color: '#1877F2', url: 'https://facebook.com/entreafetos' },
    { name: 'Site', icon: FaGlobe, color: '#E8B4B8', url: '/' }
  ];

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowMap(true);
  };

  const openGoogleMaps = (url) => {
    window.open(url, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`business-card-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Background Gradient */}
      <div className="background-gradient"></div>
      
      {/* Theme Toggle */}
      <motion.button
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </motion.button>

      <motion.div
        className="business-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="card-header"
          variants={itemVariants}
        >
          <div className="logo-container">
            <img 
              src="/logo/entreafetoslogo.png" 
              alt="Entre Afetos Logo" 
              className="logo-image"
            />
          </div>
        </motion.div>


        {/* Contact Cards */}
        <motion.div 
          className="contact-cards"
          variants={containerVariants}
        >
          <motion.div 
            className="contact-card phone"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="card-icon">
              <FaPhone />
            </div>
            <div className="card-content">
              <h3>Telefone</h3>
              <p>(83) 98610-2718</p>
              <a href="tel:+5583986102718" className="contact-link">
                Ligar agora
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="contact-card email"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="card-icon">
              <FaEnvelope />
            </div>
            <div className="card-content">
              <h3>E-mail</h3>
              <p>contato@entreafetos.com</p>
              <a href="mailto:contato@entreafetos.com" className="contact-link">
                Enviar e-mail
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="contact-card whatsapp"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="card-icon">
              <FaWhatsapp />
            </div>
            <div className="card-content">
              <h3>WhatsApp</h3>
              <p>Agendamento rápido</p>
              <a 
                href="https://wa.me/5583986102718?text=Olá! Gostaria de agendar uma consulta na Clínica Entre Afetos." 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link whatsapp-link"
              >
                Conversar no WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="contact-card website"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="card-icon">
              <FaGlobe />
            </div>
            <div className="card-content">
              <h3>Nosso Site</h3>
              <p>Acesse nosso site completo</p>
              <p>Informações detalhadas</p>
              <p>Agendamento online</p>
              <a 
                href="/" 
                className="contact-link website-link"
              >
                Acessar Site
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Locations */}
        <motion.div 
          className="locations-section"
          variants={itemVariants}
        >
          <h3>Nossas Unidades</h3>
          <div className="locations-grid">
            {locations.map((location) => (
              <motion.div
                key={location.id}
                className="location-card"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLocationClick(location)}
              >
                <div className="location-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="location-info">
                  <h4>{location.name}</h4>
                  <p className="address">{location.address}</p>
                  <p className="phone">{location.phone}</p>
                  <p className="hours">{location.hours}</p>
                </div>
                <div className="location-actions">
                  <button 
                    className="map-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openGoogleMaps(location.mapUrl);
                    }}
                  >
                    <FaExternalLinkAlt />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Social Media */}
        <motion.div 
          className="social-section"
          variants={itemVariants}
        >
          <h3>Nos siga nas redes sociais</h3>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                style={{ '--social-color': social.color }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <social.icon />
                <span className="tooltip">{social.name}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* QR Code */}
        <motion.div 
          className="qr-section"
          variants={itemVariants}
        >
          <div className="qr-container">
            <div className="qr-code">
              <FaQrcode />
            </div>
            <p>Compartilhe este cartão</p>
          </div>
        </motion.div>

        {/* Microcopy */}
        <motion.div 
          className="microcopy"
          variants={itemVariants}
        >
          <p>💡 <strong>Dica:</strong> Clique nos endereços para ver no mapa!</p>
          <p>❤️ <strong>Amor e cuidado</strong> para sua família</p>
        </motion.div>
      </motion.div>

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && selectedLocation && (
          <motion.div
            className="map-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="map-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="map-header">
                <h3>{selectedLocation.name}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowMap(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="map-info">
                <p><strong>Endereço:</strong> {selectedLocation.address}</p>
                <p><strong>Telefone:</strong> {selectedLocation.phone}</p>
                <p><strong>Horário:</strong> {selectedLocation.hours}</p>
              </div>
              <div className="map-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => openGoogleMaps(selectedLocation.mapUrl)}
                >
                  <FaExternalLinkAlt />
                  Abrir no Google Maps
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessCard;
