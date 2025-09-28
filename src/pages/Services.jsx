import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaChild, 
  FaUserGraduate, 
  FaUsers, 
  FaSearch, 
  FaBrain, 
  FaHeart,
  FaArrowRight
} from 'react-icons/fa';
import '../styles/Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: FaChild,
      title: 'Psicologia Infantil',
      description: 'Atendimento especializado para crianças de 0 a 12 anos, utilizando técnicas lúdicas e adaptadas para cada faixa etária.',
      features: [
        'Avaliação do desenvolvimento',
        'Terapia lúdica',
        'Intervenção comportamental',
        'Orientação aos pais'
      ],
      color: '#E8B4B8'
    },
    {
      id: 2,
      icon: FaUserGraduate,
      title: 'Psicologia Adolescente',
      description: 'Acompanhamento especializado para adolescentes, abordando questões específicas desta fase de desenvolvimento.',
      features: [
        'Crise de identidade',
        'Problemas escolares',
        'Relacionamentos',
        'Projetos de vida'
      ],
      color: '#D4A5A9'
    },
    {
      id: 3,
      icon: FaUsers,
      title: 'Terapia Familiar',
      description: 'Atendimento familiar sistêmico para fortalecer vínculos e melhorar a comunicação entre os membros da família.',
      features: [
        'Dinâmicas familiares',
        'Comunicação',
        'Resolução de conflitos',
        'Fortalecimento de vínculos'
      ],
      color: '#F5E6E8'
    },
    {
      id: 4,
      icon: FaSearch,
      title: 'Orientação Vocacional',
      description: 'Processo de autoconhecimento e exploração profissional para auxiliar na escolha da carreira.',
      features: [
        'Autoconhecimento',
        'Exploração profissional',
        'Testes vocacionais',
        'Planejamento de carreira'
      ],
      color: '#E8B4B8'
    },
    {
      id: 5,
      icon: FaBrain,
      title: 'Avaliação Psicológica',
      description: 'Avaliações completas para identificar necessidades específicas e orientar o tratamento adequado.',
      features: [
        'Avaliação cognitiva',
        'Avaliação emocional',
        'Relatórios detalhados',
        'Orientação terapêutica'
      ],
      color: '#D4A5A9'
    },
    {
      id: 6,
      icon: FaHeart,
      title: 'Aconselhamento Parental',
      description: 'Orientação especializada para pais e cuidadores sobre desenvolvimento infantil e estratégias educativas.',
      features: [
        'Desenvolvimento infantil',
        'Estratégias educativas',
        'Gestão comportamental',
        'Suporte emocional'
      ],
      color: '#F5E6E8'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
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
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <motion.div
            className="services-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Nossas Especialidades</h1>
            <p>
              Oferecemos serviços especializados em psicologia infanto-juvenil, 
              com foco no desenvolvimento emocional saudável e no bem-estar das famílias.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Serviços */}
      <section className="services-section">
        <div className="container">
          <motion.div
            className="services-grid"
            variants={containerVariants}
            initial="visible"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                className="service-card"
                variants={itemVariants}
                initial="visible"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="service-icon">
                  <service.icon style={{ color: service.color }} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <motion.a
                  href="https://wa.me/5583986102718?text=Olá! Gostaria de agendar uma consulta na Clínica Entre Afetos."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Saiba Mais</span>
                  <FaArrowRight />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Processo de Atendimento */}
      <section className="process-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Como Funciona Nosso Atendimento
          </motion.h2>
          <motion.div
            className="process-steps"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="process-step" variants={itemVariants}>
              <div className="step-number">1</div>
              <h3>Primeiro Contato</h3>
              <p>
                Entre em contato conosco via WhatsApp ou telefone para 
                agendar uma consulta inicial.
              </p>
            </motion.div>
            <motion.div className="process-step" variants={itemVariants}>
              <div className="step-number">2</div>
              <h3>Avaliação Inicial</h3>
              <p>
                Realizamos uma avaliação completa para entender as 
                necessidades específicas do paciente.
              </p>
            </motion.div>
            <motion.div className="process-step" variants={itemVariants}>
              <div className="step-number">3</div>
              <h3>Plano de Tratamento</h3>
              <p>
                Desenvolvemos um plano personalizado de tratamento 
                baseado na avaliação realizada.
              </p>
            </motion.div>
            <motion.div className="process-step" variants={itemVariants}>
              <div className="step-number">4</div>
              <h3>Acompanhamento</h3>
              <p>
                Iniciamos o acompanhamento regular com sessões 
                semanais ou quinzenais conforme necessário.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Perguntas Frequentes
          </motion.h2>
          <motion.div
            className="faq-list"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="faq-item" variants={itemVariants}>
              <h3>Qual a idade mínima para atendimento?</h3>
              <p>
                Atendemos crianças a partir de 2 anos de idade, utilizando 
                técnicas específicas para cada faixa etária.
              </p>
            </motion.div>
            <motion.div className="faq-item" variants={itemVariants}>
              <h3>Quanto tempo dura cada sessão?</h3>
              <p>
                As sessões têm duração de 50 minutos para crianças e adolescentes, 
                e 60 minutos para terapia familiar.
              </p>
            </motion.div>
            <motion.div className="faq-item" variants={itemVariants}>
              <h3>Os pais participam das sessões?</h3>
              <p>
                Dependendo da abordagem, os pais podem participar de algumas 
                sessões para orientação e acompanhamento do tratamento.
              </p>
            </motion.div>
            <motion.div className="faq-item" variants={itemVariants}>
              <h3>Como agendar uma consulta?</h3>
              <p>
                Você pode agendar através do WhatsApp, telefone ou 
                preenchendo o formulário de contato em nossa página.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Pronto para começar?</h2>
            <p>
              Entre em contato conosco e agende sua consulta. 
              Estamos aqui para ajudar sua família.
            </p>
            <div className="cta-buttons">
              <motion.a
                href="https://wa.me/5583986102718?text=Olá! Gostaria de agendar uma consulta na Clínica Entre Afetos."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Agendar Consulta
              </motion.a>
              <motion.a
                href="/contato"
                className="btn btn-secondary btn-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Falar Conosco
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;

