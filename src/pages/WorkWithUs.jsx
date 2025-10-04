import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/WorkWithUs.css';

const WorkWithUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    // Pega o valor do cargo para incluir no assunto
    const cargoInput = document.getElementById('role');
    const cargo = cargoInput ? cargoInput.value : 'Não informado';
    
    // Atualiza o campo hidden do assunto com o cargo
    const subjectInput = document.querySelector('input[name="_subject"]');
    if (subjectInput) {
      subjectInput.value = `Nova Candidatura: ${cargo} - Entre Afetos`;
    }
    
    // Feedback de sucesso para UX
    setSubmitted(true);
  };

  return (
    <div className="workwithus-page">
      <section className="work-hero">
        <div className="container">
          <motion.div
            className="work-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Trabalhe Conosco</h1>
            <p>
              Junte-se à nossa equipe e faça a diferença na vida de
              crianças, adolescentes e suas famílias.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="work-form-section">
        <div className="container">
          <div className="work-form-card">
            <h2>Envie seu currículo</h2>
            <p className="form-subtitle">Preencha os campos abaixo. Campos marcados com * são obrigatórios.</p>

            <form
              action="https://formsubmit.co/hcvitor21@gmail.com"
              method="POST"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="work-form"
              target="_blank"
            >
              {/* Configurações do FormSubmit */}
              <input type="hidden" name="_subject" value="Nova candidatura - Site Clínica Entre Afetos" />
              <input type="hidden" name="_template" value="box" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_autoresponse" value="Obrigado por enviar seu currículo! Recebemos sua candidatura e nossa equipe irá analisá-la. Entraremos em contato em breve caso seu perfil seja adequado às nossas necessidades. Atenciosamente, Equipe Entre Afetos" />
              {/* Honeypot */}
              <p className="hidden-field">
                <label>Não preencha: <input name="_honey" /></label>
              </p>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">👤 Nome completo *</label>
                  <input id="fullName" name="Nome_completo" type="text" required placeholder="Seu nome" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">📧 Email *</label>
                  <input id="email" name="Email" type="email" required placeholder="seu@email.com" />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">📱 Telefone *</label>
                  <input id="phone" name="Telefone" type="tel" required placeholder="(00) 00000-0000" />
                </div>

                <div className="form-group">
                  <label htmlFor="role">💼 Cargo/Área de interesse *</label>
                  <input id="role" name="Cargo/Área_de_interesse" type="text" required placeholder="Ex.: Psicólogo(a), Fonoaudiólogo(a)" />
                </div>

                <div className="form-group full">
                  <label htmlFor="resume">📎 Upload de currículo (PDF/DOC) *</label>
                  <input id="resume" name="Currículo" type="file" accept=".pdf,.doc,.docx" required />
                </div>

                <div className="form-group full">
                  <label htmlFor="message">💬 Mensagem</label>
                  <textarea id="message" name="Mensagem" rows="5" placeholder="Conte-nos brevemente sobre sua experiência"></textarea>
                </div>
              </div>

              <motion.button type="submit" className="btn btn-primary btn-lg" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Enviar candidatura
              </motion.button>

              {submitted && (
                <div className="success-note" role="status">
                  Obrigado por enviar seu currículo! Nossa equipe entrará em contato caso haja oportunidade.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkWithUs;


