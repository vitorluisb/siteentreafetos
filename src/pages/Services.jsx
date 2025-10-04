import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaComments, 
  FaHandHoldingHeart, 
  FaBrain, 
  FaBook, 
  FaAppleAlt, 
  FaRunning,
  FaChartLine,
  FaUserFriends,
  FaChild,
  FaSwimmingPool,
  FaWater,
  FaArrowRight
} from 'react-icons/fa';
import '../styles/Services.css';

const Services = () => {
  const services = [
    {
      id: 1,
      icon: FaComments,
      title: 'Fonoaudiologia',
      description: 'Atendimento especializado para crianças e adolescentes, com intervenções voltadas à comunicação, fala, linguagem e deglutição, utilizando recursos lúdicos e adequados a cada fase do desenvolvimento.',
      features: [
        'Avaliação fonoaudiológica',
        'Estimulação de linguagem oral e escrita',
        'Terapia de motricidade orofacial',
        'Intervenção em fala, fluência e voz',
        'Orientação aos pais e responsáveis'
      ],
      color: '#E8B4B8'
    },
    {
      id: 2,
      icon: FaHandHoldingHeart,
      title: 'Terapia Ocupacional',
      description: 'Atendimento especializado para crianças e adolescentes, com foco em autonomia nas atividades do dia a dia, integração sensorial e habilidades motoras finas, por meio de atividades lúdicas e funcionais.',
      features: [
        'Avaliação de desempenho ocupacional',
        'Integração sensorial',
        'Treino de AVDs (alimentação, vestir, higiene)',
        'Estimulação de coordenação motora fina e planejamento motor',
        'Orientação aos pais e responsáveis'
      ],
      color: '#D4A5A9'
    },
    {
      id: 3,
      icon: FaBrain,
      title: 'Psicologia',
      description: 'Atendimento especializado para crianças e adolescentes, com intervenções emocionais e comportamentais, utilizando técnicas lúdicas e abordagens terapêuticas adequadas a cada fase do desenvolvimento.',
      features: [
        'Avaliação psicológica',
        'Terapia individual (lúdica para crianças)',
        'Intervenção em habilidades socioemocionais',
        'Manejo de ansiedade, depressão e desafios comportamentais',
        'Orientação aos pais e responsáveis'
      ],
      color: '#F5E6E8'
    },
    {
      id: 4,
      icon: FaBook,
      title: 'Psicopedagogia',
      description: 'Atendimento especializado para crianças e adolescentes, visando prevenir e intervir nas dificuldades de aprendizagem, com estratégias lúdicas e personalizadas para cada perfil.',
      features: [
        'Avaliação psicopedagógica',
        'Intervenção em leitura, escrita e raciocínio lógico',
        'Desenvolvimento de funções executivas e estratégias de estudo',
        'Planejamento de rotinas de estudo e organização',
        'Orientação aos pais, responsáveis e à escola'
      ],
      color: '#E8B4B8'
    },
    {
      id: 5,
      icon: FaAppleAlt,
      title: 'Nutrição',
      description: 'Atendimento especializado para crianças e adolescentes, com planos alimentares individualizados e abordagem educativa, respeitando preferências, fases do desenvolvimento e necessidades específicas.',
      features: [
        'Avaliação nutricional',
        'Planejamento alimentar e reeducação nutricional',
        'Intervenção em seletividade alimentar e transtornos alimentares',
        'Educação nutricional lúdica e consciente',
        'Orientação aos pais e responsáveis'
      ],
      color: '#D4A5A9'
    },
    {
      id: 6,
      icon: FaRunning,
      title: 'Fisioterapia',
      description: 'Atendimento especializado para crianças e adolescentes, com foco no desenvolvimento motor, postura, reabilitação e prevenção de lesões, por meio de exercícios e atividades terapêuticas.',
      features: [
        'Avaliação motora e funcional',
        'Estimulação motora global e equilíbrio',
        'Fortalecimento, alongamentos e reabilitação',
        'Intervenção em alterações posturais e ortopédicas',
        'Orientação aos pais e responsáveis'
      ],
      color: '#F5E6E8'
    },
    {
      id: 7,
      icon: FaChartLine,
      title: 'Analista do Comportamento',
      description: 'Atendimento especializado para crianças e adolescentes, utilizando princípios da Análise do Comportamento Aplicada (ABA) com metas mensuráveis e atividades lúdicas e funcionais.',
      features: [
        'Avaliação funcional do comportamento',
        'Elaboração de plano ABA individualizado',
        'Treino de habilidades adaptativas, sociais e de comunicação',
        'Redução de comportamentos-problema',
        'Treinamento parental e de cuidadores'
      ],
      color: '#E8B4B8'
    },
    {
      id: 8,
      icon: FaUserFriends,
      title: 'Acompanhante Terapêutico',
      description: 'Suporte individualizado a crianças e adolescentes em contextos naturais (escola, casa e comunidade), promovendo generalização de habilidades, autonomia e inclusão social.',
      features: [
        'Plano de intervenção em ambiente natural',
        'Mediação social, acadêmica e comportamental',
        'Manejo de comportamentos em contexto real',
        'Treino de rotinas, autonomia e independência',
        'Orientação aos pais, responsáveis e equipe escolar'
      ],
      color: '#D4A5A9'
    },
    {
      id: 9,
      icon: FaChild,
      title: 'Psicomotricista',
      description: 'Atendimento especializado para crianças e adolescentes, integrando corpo e psique para desenvolver coordenação, esquema corporal, lateralidade, organização espaço-temporal e expressão corporal.',
      features: [
        'Avaliação psicomotora',
        'Estimulação de coordenação global e equilíbrio',
        'Consciência corporal, lateralidade e ritmo',
        'Organização espaço-temporal e praxias',
        'Orientação aos pais e responsáveis'
      ],
      color: '#F5E6E8'
    },
    {
      id: 10,
      icon: FaSwimmingPool,
      title: 'Hidroterapia',
      description: 'Atendimento especializado para crianças e adolescentes em ambiente aquático, utilizando os benefícios da água para estimular o desenvolvimento motor, sensorial e a reabilitação.',
      features: [
        'Avaliação para intervenção aquática',
        'Estimulação motora e funcional em piscina',
        'Fortalecimento, mobilidade e equilíbrio na água',
        'Integração sensorial e relaxamento aquático',
        'Orientação aos pais e responsáveis'
      ],
      color: '#E8B4B8'
    },
    {
      id: 11,
      icon: FaWater,
      title: 'Natação',
      description: 'Aulas para crianças e adolescentes, com foco em adaptação ao meio líquido, segurança aquática, desenvolvimento motor e técnicas de nado, por meio de atividades lúdicas e progressivas.',
      features: [
        'Avaliação de nível e adaptação ao meio aquático',
        'Técnicas de respiração, flutuação e propulsão',
        'Desenvolvimento de coordenação e estilos de nado',
        'Segurança e autonomia na água',
        'Orientação aos pais e responsáveis'
      ],
      color: '#D4A5A9'
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

