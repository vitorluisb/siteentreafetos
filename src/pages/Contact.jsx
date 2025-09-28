import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock } from 'react-icons/fa';
import OpenStreetMap from '../components/OpenStreetMap';
import '../styles/Contact.css';


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    unit: ''
  });


  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar se a unidade foi selecionada
    if (!formData.unit) {
      alert('Por favor, selecione uma unidade antes de enviar.');
      return;
    }

    // Números de WhatsApp para cada unidade
    const whatsappNumbers = {
      'guarabira1': '5583986102718', // Guarabira Unidade 1
    'guarabira2': '5583986102718', // Guarabira Unidade 2
    'solanea': '5583986102718'     // Solânea
    };

    // Formatear a mensagem
    const message = `Olá! Meu nome é ${formData.name}.
Telefone: ${formData.phone}

${formData.message}

Enviado através do site da Clínica Entre Afetos.`;

    // Obter o número correto baseado na unidade selecionada
    const phoneNumber = whatsappNumbers[formData.unit];
    
    // Criar URL do WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Redirecionar para WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpar formulário após envio
    setFormData({
      name: '',
      phone: '',
      message: '',
      unit: ''
    });
    
    setSubmitStatus('success');
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const locations = [
    {
      id: 1,
      name: 'Clínica Entre Afetos - Guarabira Centro',
      address: 'Manoel Lordão, 219 - Centro, Guarabira - PB',
      phone: '(83) 98610-2718',
      hours: 'Seg-Sex: 8h às 18h',
      position: { lat: -6.8566291732801155, lng: -35.486531737170196 }
    },
    {
      id: 2,
      name: 'Clínica Entre Afetos - Guarabira',
      address: 'José Bonifácio, 15 - Centro, Guarabira - PB',
      phone: '(83) 98610-2718',
      hours: 'Seg-Sex: 8h às 18h',
      position: { lat: -6.851286547919602, lng: -35.48777473822952 }
    },
    {
      id: 3,
      name: 'Clínica Entre Afetos - Solânea',
      address: 'Rua Cirilo da Costa Maranhão, 284 - Centro, Solânea - PB',
      phone: '(83) 98610-2718',
      hours: 'Seg-Sex: 8h às 18h',
      position: { lat: -6.759461231989829, lng: -35.66164279430529 }
    }
  ];

  const whatsappNumber = '5583986102718';
  const whatsappMessage = 'Olá! Gostaria de mais informações sobre a Clínica Entre Afetos.';

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
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <motion.div
            className="contact-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Entre em Contato</h1>
            <p>
              Estamos aqui para ajudar sua família. Entre em contato conosco 
              e agende sua consulta.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="contact-info">
        <div className="container">
          <motion.div
            className="contact-info-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="contact-card" variants={itemVariants}>
              <div className="contact-icon">
                <FaPhone />
              </div>
              <h3>Telefone</h3>
              <p>(83) 98610-2718</p>
                <p>(83) 98610-2718</p>
            </motion.div>
            <motion.div className="contact-card" variants={itemVariants}>
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <h3>E-mail</h3>
              <p>contato@entreafetos.com</p>
            </motion.div>
            <motion.div className="contact-card" variants={itemVariants}>
              <div className="contact-icon">
                <FaClock />
              </div>
              <h3>Horário de Funcionamento</h3>
              <p>Segunda a Sexta</p>
              <p>8h às 18h</p>
            </motion.div>
            <motion.div className="contact-card" variants={itemVariants}>
              <div className="contact-icon whatsapp">
                <FaWhatsapp />
              </div>
              <h3>WhatsApp</h3>
              <p>Atendimento Rápido</p>
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                Falar no WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Formulário e Mapa */}
      <section className="contact-form-map">
        <div className="container">
          <div className="form-map-grid">
            {/* Formulário */}
            <motion.div
              className="contact-form-section"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2>Fale Conosco via WhatsApp</h2>
              <p className="form-description">
                Preencha o formulário abaixo e seja redirecionado automaticamente 
                para o WhatsApp da unidade escolhida.
              </p>
              <form onSubmit={handleSubmit} className="contact-form whatsapp-form">
                <div className="form-group">
                  <label htmlFor="name">Nome Completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Telefone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(83) 98610-2718"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Escolha a Unidade *</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione uma unidade</option>
                    <option value="guarabira1">Clínica Guarabira (Unidade 1) - Manoel Lordão</option>
                    <option value="guarabira2">Clínica Guarabira (Unidade 2) - José Bonifácio</option>
                    <option value="solanea">Clínica Solânea - Cirilo da Costa Maranhão</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Mensagem *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Descreva como podemos ajudá-lo (agendamento, informações, dúvidas, etc.)"
                    required
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="btn btn-whatsapp btn-lg submit-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaWhatsapp className="btn-icon" />
                  Enviar via WhatsApp
                </motion.button>
                
                {submitStatus === 'success' && (
                  <div className="success-message">
                    <FaWhatsapp />
                    Redirecionando para o WhatsApp...
                  </div>
                )}
              </form>
            </motion.div>

            {/* Mapa */}
            <motion.div
              className="map-section"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2>Nossas Unidades</h2>
              <p className="map-description">
                Clique nos marcadores para abrir no Google Maps
              </p>
              <div className="map-container">
                <OpenStreetMap 
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationClick}
                />
              </div>
              <div className="locations-list">
                {locations.map((location) => (
                  <motion.div 
                    key={location.id} 
                    className={`location-item ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                    onClick={() => handleLocationClick(location)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4>{location.name}</h4>
                    <p className="clickable-address">
                      <FaMapMarkerAlt /> {location.address}
                    </p>
                    <p><FaPhone /> {location.phone}</p>
                    <p><FaClock /> {location.hours}</p>
                    <div className="location-hint">
                      <span>Clique para ver no mapa</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
